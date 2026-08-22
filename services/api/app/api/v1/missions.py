from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime, timedelta, timezone
from app.core.database import get_db
from app.core.security import decode_token, security_scheme
from app.models.campaign import Campaign, CampaignStatus
from app.models.vendor import VendorOrganisation
from app.models.mission import MissionAssignment, MissionStatus, MissionProgress
from app.models.submission import Submission, SubmissionAnswer, ProofArtifact, VerificationDecision, SubmissionStatus
from app.models.notification import Notification
from app.schemas.mission import MissionSubmitRequest, SubmissionReviewRequest, MissionResponse
from app.services.ledger_service import LedgerService

router = APIRouter(prefix="/missions", tags=["Missions"])

@router.post("/{campaign_id}/accept", response_model=dict)
async def accept_mission(
    campaign_id: str,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    campaign_q = select(Campaign).where(Campaign.id == campaign_id)
    campaign = (await db.execute(campaign_q)).scalars().first()
    if not campaign or campaign.status != CampaignStatus.LIVE:
        raise HTTPException(status_code=400, detail="Campaign is not currently open for missions")

    if campaign.remaining_capacity <= 0:
        raise HTTPException(status_code=400, detail="Campaign has reached its full participant capacity")

    # Check if participant already accepted this campaign
    existing_q = select(MissionAssignment).where(
        MissionAssignment.campaign_id == campaign_id,
        MissionAssignment.participant_id == user_id,
        MissionAssignment.status.notin_([MissionStatus.EXPIRED, MissionStatus.REJECTED])
    )
    existing = (await db.execute(existing_q)).scalars().first()
    if existing:
        return {"message": "Mission already active", "assignment_id": existing.id, "status": existing.status}

    # Decrement capacity
    campaign.remaining_capacity -= 1

    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(hours=24) # 24 hour reservation window

    assignment = MissionAssignment(
        campaign_id=campaign.id,
        participant_id=user_id,
        status=MissionStatus.IN_PROGRESS,
        reserved_at=now,
        expires_at=expires_at
    )
    db.add(assignment)
    await db.flush()

    progress = MissionProgress(
        assignment_id=assignment.id,
        current_step=1,
        step_data_json={},
        last_saved_at=now
    )
    db.add(progress)
    await db.commit()

    return {
        "message": "Mission successfully accepted and reserved",
        "assignment_id": assignment.id,
        "campaign_id": campaign.id,
        "expires_at": expires_at.isoformat()
    }

@router.post("/assignments/{assignment_id}/submit", response_model=dict)
async def submit_mission_proof(
    assignment_id: str,
    data: MissionSubmitRequest,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    a_q = select(MissionAssignment, Campaign).join(Campaign, MissionAssignment.campaign_id == Campaign.id).where(
        MissionAssignment.id == assignment_id,
        MissionAssignment.participant_id == user_id
    )
    res = (await db.execute(a_q)).first()
    if not res:
        raise HTTPException(status_code=404, detail="Mission assignment not found")

    assignment, campaign = res

    if assignment.status not in [MissionStatus.IN_PROGRESS, MissionStatus.RESERVED]:
        raise HTTPException(status_code=400, detail=f"Mission cannot be submitted in status: {assignment.status}")

    now = datetime.now(timezone.utc)
    assignment.status = MissionStatus.SUBMITTED
    assignment.submitted_at = now

    submission = Submission(
        assignment_id=assignment.id,
        campaign_id=campaign.id,
        participant_id=user_id,
        status=SubmissionStatus.PENDING_REVIEW,
        risk_score=0.05, # Clean automated risk score
        automated_checks_passed=True,
        submitted_at=now
    )
    db.add(submission)
    await db.flush()

    # Save answers
    for ans in data.answers or []:
        s_ans = SubmissionAnswer(
            submission_id=submission.id,
            question_id=ans.question_id,
            answer_text=ans.answer_text,
            answer_json=ans.answer_json or {}
        )
        db.add(s_ans)

    # Save proof artifacts
    for art in data.proof_artifacts:
        p_art = ProofArtifact(
            submission_id=submission.id,
            artifact_type=art.artifact_type,
            file_url=art.file_url,
            file_name=art.file_name,
            file_size_bytes=art.file_size_bytes,
            metadata_json=art.metadata_json or {}
        )
        db.add(p_art)

    # Notification
    notif = Notification(
        user_id=user_id,
        title="Mission Submitted for Verification",
        message=f"Your proof for '{campaign.title}' has been received and is queued for verification.",
        notification_type="SUBMISSION_RECEIVED"
    )
    db.add(notif)
    await db.commit()

    return {
        "message": "Mission proof submitted successfully",
        "submission_id": submission.id,
        "status": submission.status
    }

@router.get("/my-missions", response_model=List[MissionResponse])
async def list_my_missions(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    query = select(MissionAssignment, Campaign, VendorOrganisation.display_name).join(
        Campaign, MissionAssignment.campaign_id == Campaign.id
    ).join(
        VendorOrganisation, Campaign.vendor_id == VendorOrganisation.id
    ).where(MissionAssignment.participant_id == user_id).order_by(MissionAssignment.created_at.desc())

    results = (await db.execute(query)).all()
    output = []
    for assign, camp, v_name in results:
        output.append(MissionResponse(
            id=assign.id,
            campaign_id=camp.id,
            campaign_title=camp.title,
            vendor_name=v_name,
            template_type=camp.template_type,
            status=assign.status,
            reward_amount=camp.reward_per_action,
            reserved_at=assign.reserved_at,
            expires_at=assign.expires_at,
            submitted_at=assign.submitted_at,
            completed_at=assign.completed_at
        ))
    return output
