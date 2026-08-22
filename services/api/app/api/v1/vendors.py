from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.security import decode_token, security_scheme
from app.models.vendor import VendorOrganisation, VendorMembership
from app.models.campaign import Campaign, CampaignStatus
from app.models.submission import Submission, SubmissionStatus, VerificationDecision
from app.models.mission import MissionAssignment, MissionStatus
from app.schemas.wallet import VendorDepositRequest, VendorSummaryResponse
from app.schemas.mission import SubmissionReviewRequest
from app.services.ledger_service import LedgerService
from datetime import datetime, timezone

router = APIRouter(prefix="/vendors", tags=["Vendors"])

@router.get("/summary", response_model=VendorSummaryResponse)
async def get_vendor_summary(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    m_q = select(VendorMembership, VendorOrganisation).join(
        VendorOrganisation, VendorMembership.vendor_id == VendorOrganisation.id
    ).where(VendorMembership.user_id == user_id, VendorMembership.is_active == True)
    res = (await db.execute(m_q)).first()
    if not res:
        raise HTTPException(status_code=404, detail="No active vendor found for this user")

    membership, vendor = res

    balances = await LedgerService.get_vendor_balance(db, vendor.id)

    # Count active campaigns
    c_q = select(func.count(Campaign.id)).where(Campaign.vendor_id == vendor.id, Campaign.status == CampaignStatus.LIVE)
    active_camps = (await db.execute(c_q)).scalar_one()

    # Count total verified submissions
    s_q = select(func.count(Submission.id)).join(Campaign, Submission.campaign_id == Campaign.id).where(
        Campaign.vendor_id == vendor.id,
        Submission.status == SubmissionStatus.APPROVED
    )
    total_verified = (await db.execute(s_q)).scalar_one()

    return VendorSummaryResponse(
        id=vendor.id,
        legal_name=vendor.legal_name,
        display_name=vendor.display_name,
        industry=vendor.industry,
        status=vendor.status,
        available_balance=balances["available_balance"],
        total_deposited=balances["total_deposited"],
        active_campaigns_count=active_camps,
        total_verified_actions=total_verified
    )

@router.get("/my-campaigns", response_model=List[Dict[str, Any]])
async def list_vendor_campaigns(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    m_q = select(VendorMembership).where(VendorMembership.user_id == user_id, VendorMembership.is_active == True)
    membership = (await db.execute(m_q)).scalars().first()
    if not membership:
        raise HTTPException(status_code=404, detail="Vendor not found")

    c_q = select(Campaign).where(Campaign.vendor_id == membership.vendor_id).order_by(Campaign.created_at.desc())
    campaigns = (await db.execute(c_q)).scalars().all()

    results = []
    for c in campaigns:
        # Count verified submissions for this campaign
        v_count_q = select(func.count(Submission.id)).where(Submission.campaign_id == c.id, Submission.status == SubmissionStatus.APPROVED)
        verified_count = (await db.execute(v_count_q)).scalar_one()

        p_count_q = select(func.count(Submission.id)).where(Submission.campaign_id == c.id, Submission.status == SubmissionStatus.PENDING_REVIEW)
        pending_count = (await db.execute(p_count_q)).scalar_one()

        results.append({
            "id": c.id,
            "title": c.title,
            "template_type": c.template_type,
            "status": c.status,
            "reward_per_action": c.reward_per_action,
            "total_capacity": c.total_capacity,
            "remaining_capacity": c.remaining_capacity,
            "total_budget": c.total_budget,
            "budget_spent": c.budget_spent,
            "verified_actions": verified_count,
            "pending_review": pending_count,
            "created_at": c.created_at.isoformat()
        })
    return results

@router.get("/submissions-queue", response_model=List[Dict[str, Any]])
async def list_vendor_submissions_queue(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    m_q = select(VendorMembership).where(VendorMembership.user_id == user_id, VendorMembership.is_active == True)
    membership = (await db.execute(m_q)).scalars().first()
    if not membership:
        raise HTTPException(status_code=404, detail="Vendor not found")

    q = select(Submission, Campaign).join(
        Campaign, Submission.campaign_id == Campaign.id
    ).where(Campaign.vendor_id == membership.vendor_id).order_by(Submission.submitted_at.desc())

    items = (await db.execute(q)).all()
    results = []
    for sub, camp in items:
        results.append({
            "submission_id": sub.id,
            "campaign_id": camp.id,
            "campaign_title": camp.title,
            "template_type": camp.template_type,
            "participant_id": sub.participant_id[:8] + "...",
            "status": sub.status,
            "risk_score": sub.risk_score,
            "reward_amount": camp.reward_per_action,
            "submitted_at": sub.submitted_at.isoformat()
        })
    return results

@router.post("/submissions/{submission_id}/review", response_model=dict)
async def review_submission(
    submission_id: str,
    data: SubmissionReviewRequest,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    sub_q = select(Submission, Campaign, MissionAssignment).join(
        Campaign, Submission.campaign_id == Campaign.id
    ).join(
        MissionAssignment, Submission.assignment_id == MissionAssignment.id
    ).where(Submission.id == submission_id)

    res = (await db.execute(sub_q)).first()
    if not res:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission, campaign, assignment = res
    now = datetime.now(timezone.utc)

    if data.decision == "APPROVED":
        submission.status = SubmissionStatus.APPROVED
        assignment.status = MissionStatus.APPROVED
        assignment.completed_at = now
        campaign.budget_spent += (campaign.reward_per_action + campaign.platform_fee_per_action)

        # Settle immutable ledger
        await LedgerService.settle_approved_mission(
            db,
            submission.id,
            assignment.participant_id,
            campaign.reward_per_action,
            campaign.platform_fee_per_action
        )
    elif data.decision == "REJECTED":
        submission.status = SubmissionStatus.REJECTED
        assignment.status = MissionStatus.REJECTED
        # Release capacity back to campaign
        campaign.remaining_capacity += 1
    else:
        submission.status = SubmissionStatus.UNDER_REVIEW

    decision = VerificationDecision(
        submission_id=submission.id,
        decided_by_user_id=user_id,
        decision=data.decision,
        rejection_reason_code=data.rejection_reason_code,
        internal_notes=data.internal_notes,
        participant_feedback=data.participant_feedback,
        decided_at=now
    )
    db.add(decision)
    await db.commit()

    return {"message": f"Submission marked as {data.decision}", "submission_id": submission.id}

@router.post("/funds/deposit", response_model=dict)
async def deposit_vendor_funds(
    data: VendorDepositRequest,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    m_q = select(VendorMembership).where(VendorMembership.user_id == user_id, VendorMembership.is_active == True)
    membership = (await db.execute(m_q)).scalars().first()
    if not membership:
        raise HTTPException(status_code=404, detail="Vendor not found")

    ref = f"DEP_{int(datetime.now().timestamp())}_{membership.vendor_id[:6]}"
    journal = await LedgerService.record_vendor_deposit(db, membership.vendor_id, data.amount, ref)
    await db.commit()

    return {
        "message": f"Deposit of ₹{data.amount:,.2f} recorded successfully",
        "journal_id": journal.id,
        "payment_ref": ref
    }
