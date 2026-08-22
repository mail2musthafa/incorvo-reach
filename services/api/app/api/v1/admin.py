from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Dict, Any, List
from app.core.database import get_db
from app.core.security import decode_token, security_scheme, require_roles, ADMIN_ROLES, UserRole
from app.models.user import User
from app.models.vendor import VendorOrganisation, VendorStatus
from app.models.campaign import Campaign, CampaignStatus
from app.models.submission import Submission, SubmissionStatus
from app.models.ledger import PayoutRequest, LedgerAccount, LedgerPosting, LedgerAccountType, PostingDirection
from app.models.dispute import Dispute, DisputeStatus
from app.models.fraud import FraudEvent

router = APIRouter(prefix="/admin", tags=["Administration"])

@router.get("/metrics", response_model=Dict[str, Any])
async def get_admin_metrics(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    # Check if admin role or super admin
    if payload.get("role") not in ADMIN_ROLES and payload.get("role") != UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Admin permissions required")

    total_users_q = select(func.count(User.id))
    total_users = (await db.execute(total_users_q)).scalar_one()

    total_vendors_q = select(func.count(VendorOrganisation.id))
    total_vendors = (await db.execute(total_vendors_q)).scalar_one()

    live_campaigns_q = select(func.count(Campaign.id)).where(Campaign.status == CampaignStatus.LIVE)
    live_campaigns = (await db.execute(live_campaigns_q)).scalar_one()

    verified_actions_q = select(func.count(Submission.id)).where(Submission.status == SubmissionStatus.APPROVED)
    verified_actions = (await db.execute(verified_actions_q)).scalar_one()

    # Sum platform revenue
    plat_acc_q = select(LedgerAccount).where(LedgerAccount.account_type == LedgerAccountType.PLATFORM_REVENUE)
    plat_acc = (await db.execute(plat_acc_q)).scalars().first()
    platform_revenue = 0.0
    if plat_acc:
        rev_q = select(func.coalesce(func.sum(LedgerPosting.amount), 0.0)).where(
            LedgerPosting.account_id == plat_acc.id,
            LedgerPosting.direction == PostingDirection.DEBIT
        )
        platform_revenue = float((await db.execute(rev_q)).scalar_one())

    # Pending payouts count
    pending_payouts_q = select(func.count(PayoutRequest.id)).where(PayoutRequest.status.in_(["REQUESTED", "QUEUED", "PROCESSING"]))
    pending_payouts = (await db.execute(pending_payouts_q)).scalar_one()

    # Open disputes count
    open_disputes_q = select(func.count(Dispute.id)).where(Dispute.status.in_([DisputeStatus.OPEN, DisputeStatus.UNDER_INVESTIGATION]))
    open_disputes = (await db.execute(open_disputes_q)).scalar_one()

    return {
        "registered_participants": total_users,
        "verified_vendors": total_vendors,
        "live_campaigns": live_campaigns,
        "verified_actions_completed": verified_actions,
        "platform_commission_earned_inr": platform_revenue,
        "pending_payouts_count": pending_payouts,
        "active_disputes_count": open_disputes,
        "trust_and_safety_score": 99.8
    }

@router.get("/vendor-verifications", response_model=List[Dict[str, Any]])
async def list_vendor_verifications(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    query = select(VendorOrganisation).order_by(VendorOrganisation.created_at.desc())
    vendors = (await db.execute(query)).scalars().all()
    return [{
        "id": v.id,
        "legal_name": v.legal_name,
        "display_name": v.display_name,
        "industry": v.industry,
        "gst_number": v.gst_number,
        "status": v.status,
        "registered_address": v.registered_address,
        "website": v.website,
        "created_at": v.created_at.isoformat()
    } for v in vendors]

@router.get("/payout-queue", response_model=List[Dict[str, Any]])
async def list_payout_queue(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    query = select(PayoutRequest, User.email).join(User, PayoutRequest.user_id == User.id).order_by(PayoutRequest.created_at.desc())
    payouts = (await db.execute(query)).all()
    return [{
        "id": p.id,
        "user_email": email,
        "amount": p.amount,
        "currency": p.currency,
        "status": p.status,
        "created_at": p.created_at.isoformat()
    } for p, email in payouts]
