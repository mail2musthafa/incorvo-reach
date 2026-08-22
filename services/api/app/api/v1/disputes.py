from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any, Optional
from app.core.database import get_db
from app.core.security import decode_token, security_scheme, require_roles, ADMIN_ROLES
from app.models.dispute import Dispute, DisputeMessage, DisputeStatus
from app.models.submission import Submission, SubmissionStatus
from app.models.campaign import Campaign
from app.models.mission import MissionAssignment, MissionStatus
from app.services.ledger_service import LedgerService
from pydantic import BaseModel
from datetime import datetime, timezone

router = APIRouter(prefix="/disputes", tags=["Disputes & Resolution"])

class CreateDisputeRequest(BaseModel):
    submission_id: str
    dispute_reason: str # INCORRECT_REJECTION, MISSING_REWARD, FAKE_PROOF, CONTENT_QUALITY_FAILURE
    explanation: str
    evidence_urls: Optional[List[str]] = []

class DisputeMessageRequest(BaseModel):
    message_text: str
    attachments: Optional[List[str]] = []

class ResolveDisputeRequest(BaseModel):
    decision: str # RESOLVED_PARTICIPANT_FAVOUR or RESOLVED_VENDOR_FAVOUR
    resolution_notes: str

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def raise_dispute(
    data: CreateDisputeRequest,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    sub_q = select(Submission, Campaign).join(Campaign, Submission.campaign_id == Campaign.id).where(Submission.id == data.submission_id)
    res = (await db.execute(sub_q)).first()
    if not res:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission, campaign = res
    submission.status = SubmissionStatus.DISPUTED

    dispute = Dispute(
        submission_id=submission.id,
        raised_by_user_id=user_id,
        target_vendor_id=campaign.vendor_id,
        dispute_reason=data.dispute_reason,
        explanation=data.explanation,
        evidence_urls=data.evidence_urls or [],
        status=DisputeStatus.OPEN
    )
    db.add(dispute)
    await db.flush()

    # Initial message
    db.add(DisputeMessage(
        dispute_id=dispute.id,
        sender_user_id=user_id,
        message_text=data.explanation,
        attachments_json=data.evidence_urls or []
    ))
    await db.commit()

    return {"message": "Dispute registered successfully", "dispute_id": dispute.id, "status": dispute.status}

@router.get("", response_model=List[Dict[str, Any]])
async def list_disputes(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    query = select(Dispute).order_by(Dispute.created_at.desc())
    disputes = (await db.execute(query)).scalars().all()

    return [{
        "id": d.id,
        "submission_id": d.submission_id,
        "raised_by_user_id": d.raised_by_user_id,
        "target_vendor_id": d.target_vendor_id,
        "dispute_reason": d.dispute_reason,
        "explanation": d.explanation,
        "status": d.status,
        "resolution_notes": d.resolution_notes,
        "created_at": d.created_at.isoformat()
    } for d in disputes]

@router.post("/{dispute_id}/resolve", response_model=dict)
async def resolve_dispute(
    dispute_id: str,
    data: ResolveDisputeRequest,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Admin moderation endpoint: Resolves dispute and triggers automated double-entry ledger adjustment."""
    payload = decode_token(auth.credentials)
    admin_id = payload.get("sub")

    d_q = select(Dispute, Submission, Campaign, MissionAssignment).join(
        Submission, Dispute.submission_id == Submission.id
    ).join(
        Campaign, Submission.campaign_id == Campaign.id
    ).join(
        MissionAssignment, Submission.assignment_id == MissionAssignment.id
    ).where(Dispute.id == dispute_id)

    res = (await db.execute(d_q)).first()
    if not res:
        raise HTTPException(status_code=404, detail="Dispute not found")

    dispute, submission, campaign, assignment = res

    dispute.status = data.decision
    dispute.resolution_notes = data.resolution_notes
    dispute.assigned_moderator_id = admin_id

    if data.decision == DisputeStatus.RESOLVED_PARTICIPANT_FAVOUR:
        submission.status = SubmissionStatus.APPROVED
        assignment.status = MissionStatus.APPROVED
        assignment.completed_at = datetime.now(timezone.utc)
        # Execute ledger transfer to participant
        await LedgerService.settle_approved_mission(
            db,
            submission.id,
            assignment.participant_id,
            campaign.reward_per_action,
            campaign.platform_fee_per_action
        )
    else:
        submission.status = SubmissionStatus.REJECTED
        assignment.status = MissionStatus.REJECTED

    await db.commit()
    return {"message": f"Dispute resolved with decision: {data.decision}", "dispute_id": dispute.id}
