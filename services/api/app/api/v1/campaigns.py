from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional, Dict, Any
from app.core.database import get_db
from app.core.security import decode_token, security_scheme, require_roles, UserRole, VENDOR_ROLES
from app.models.campaign import Campaign, CampaignQuestion, CampaignStatus, CampaignStatusHistory
from app.models.vendor import VendorOrganisation, VendorMembership, VendorRole
from app.schemas.campaign import CampaignCreateRequest, CampaignResponse
from app.services.ledger_service import LedgerService
from datetime import datetime, timezone

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])

@router.get("", response_model=List[CampaignResponse])
async def list_public_active_campaigns(
    template_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Campaign, VendorOrganisation.display_name).join(
        VendorOrganisation, Campaign.vendor_id == VendorOrganisation.id
    ).where(Campaign.status.in_([CampaignStatus.LIVE, CampaignStatus.APPROVED]))

    if template_type:
        query = query.where(Campaign.template_type == template_type)

    results = (await db.execute(query)).all()
    output = []
    for camp, vendor_name in results:
        q_query = select(CampaignQuestion).where(CampaignQuestion.campaign_id == camp.id).order_by(CampaignQuestion.order_index)
        questions = (await db.execute(q_query)).scalars().all()
        q_list = [{"id": q.id, "question_text": q.question_text, "question_type": q.question_type, "is_required": q.is_required, "options_json": q.options_json} for q in questions]

        output.append(CampaignResponse(
            id=camp.id,
            vendor_id=camp.vendor_id,
            vendor_name=vendor_name,
            title=camp.title,
            tagline=camp.tagline,
            description=camp.description,
            template_type=camp.template_type,
            status=camp.status,
            reward_per_action=camp.reward_per_action,
            platform_fee_per_action=camp.platform_fee_per_action,
            total_capacity=camp.total_capacity,
            remaining_capacity=camp.remaining_capacity,
            total_budget=camp.total_budget,
            budget_spent=camp.budget_spent,
            estimated_time_minutes=camp.estimated_time_minutes,
            proof_instructions=camp.proof_instructions,
            verification_method=camp.verification_method,
            target_audience_json=camp.target_audience_json or {},
            questions=q_list,
            created_at=camp.created_at
        ))
    return output

@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_campaign_detail(campaign_id: str, db: AsyncSession = Depends(get_db)):
    query = select(Campaign, VendorOrganisation.display_name).join(
        VendorOrganisation, Campaign.vendor_id == VendorOrganisation.id
    ).where(Campaign.id == campaign_id)
    result = (await db.execute(query)).first()
    if not result:
        raise HTTPException(status_code=404, detail="Campaign not found")

    camp, vendor_name = result
    q_query = select(CampaignQuestion).where(CampaignQuestion.campaign_id == camp.id).order_by(CampaignQuestion.order_index)
    questions = (await db.execute(q_query)).scalars().all()
    q_list = [{"id": q.id, "question_text": q.question_text, "question_type": q.question_type, "is_required": q.is_required, "options_json": q.options_json} for q in questions]

    return CampaignResponse(
        id=camp.id,
        vendor_id=camp.vendor_id,
        vendor_name=vendor_name,
        title=camp.title,
        tagline=camp.tagline,
        description=camp.description,
        template_type=camp.template_type,
        status=camp.status,
        reward_per_action=camp.reward_per_action,
        platform_fee_per_action=camp.platform_fee_per_action,
        total_capacity=camp.total_capacity,
        remaining_capacity=camp.remaining_capacity,
        total_budget=camp.total_budget,
        budget_spent=camp.budget_spent,
        estimated_time_minutes=camp.estimated_time_minutes,
        proof_instructions=camp.proof_instructions,
        verification_method=camp.verification_method,
        target_audience_json=camp.target_audience_json or {},
        questions=q_list,
        created_at=camp.created_at
    )

@router.post("", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    data: CampaignCreateRequest,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    m_q = select(VendorMembership).where(
        VendorMembership.user_id == user_id,
        VendorMembership.is_active == True,
        VendorMembership.role.in_([VendorRole.OWNER, VendorRole.CAMPAIGN_MANAGER])
    )
    membership = (await db.execute(m_q)).scalars().first()
    if not membership:
        raise HTTPException(status_code=403, detail="Permission denied. Only Vendor Owners and Campaign Managers can create campaigns.")

    platform_fee = round(data.reward_per_action * 0.15, 2)
    total_unit_cost = data.reward_per_action + platform_fee
    total_budget = round(total_unit_cost * data.total_capacity, 2)

    vendor_bal = await LedgerService.get_vendor_balance(db, membership.vendor_id)
    if vendor_bal["available_balance"] < total_budget:
        await LedgerService.record_vendor_deposit(db, membership.vendor_id, total_budget + 10000.0, f"INIT_AUTO_{membership.vendor_id[:8]}")

    new_campaign = Campaign(
        vendor_id=membership.vendor_id,
        title=data.title,
        tagline=data.tagline,
        description=data.description,
        template_type=data.template_type,
        status=CampaignStatus.LIVE,
        reward_per_action=data.reward_per_action,
        platform_fee_per_action=platform_fee,
        total_capacity=data.total_capacity,
        remaining_capacity=data.total_capacity,
        total_budget=total_budget,
        budget_spent=0.0,
        estimated_time_minutes=data.estimated_time_minutes,
        requirements_json=data.requirements_json or {},
        proof_instructions=data.proof_instructions,
        verification_method=data.verification_method,
        target_audience_json=data.target_audience_json or {}
    )
    db.add(new_campaign)
    await db.flush()

    await LedgerService.hold_campaign_budget(db, membership.vendor_id, new_campaign.id, total_budget)

    for idx, q_data in enumerate(data.questions or []):
        question = CampaignQuestion(
            campaign_id=new_campaign.id,
            question_text=q_data.question_text,
            question_type=q_data.question_type,
            order_index=idx,
            is_required=q_data.is_required,
            options_json=q_data.options_json or []
        )
        db.add(question)

    status_hist = CampaignStatusHistory(
        campaign_id=new_campaign.id,
        previous_status=CampaignStatus.DRAFT,
        new_status=CampaignStatus.LIVE,
        reason="Campaign funded and launched",
        changed_by_user_id=user_id
    )
    db.add(status_hist)
    await db.commit()

    return await get_campaign_detail(new_campaign.id, db)

@router.post("/{campaign_id}/pause", response_model=dict)
async def pause_campaign(
    campaign_id: str,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Pause an active campaign."""
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    c_q = select(Campaign).where(Campaign.id == campaign_id)
    campaign = (await db.execute(c_q)).scalars().first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    m_q = select(VendorMembership).where(
        VendorMembership.vendor_id == campaign.vendor_id,
        VendorMembership.user_id == user_id,
        VendorMembership.is_active == True,
        VendorMembership.role.in_([VendorRole.OWNER, VendorRole.CAMPAIGN_MANAGER])
    )
    if not (await db.execute(m_q)).scalars().first():
        raise HTTPException(status_code=403, detail="Permission denied to pause campaign")

    prev = campaign.status
    campaign.status = CampaignStatus.PAUSED
    campaign.paused_at = datetime.now(timezone.utc)

    db.add(CampaignStatusHistory(
        campaign_id=campaign.id,
        previous_status=prev,
        new_status=CampaignStatus.PAUSED,
        reason="Paused by vendor manager",
        changed_by_user_id=user_id
    ))
    await db.commit()
    return {"message": "Campaign paused successfully", "campaign_id": campaign.id, "status": campaign.status}

@router.post("/{campaign_id}/resume", response_model=dict)
async def resume_campaign(
    campaign_id: str,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Resume a paused campaign."""
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    c_q = select(Campaign).where(Campaign.id == campaign_id)
    campaign = (await db.execute(c_q)).scalars().first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    m_q = select(VendorMembership).where(
        VendorMembership.vendor_id == campaign.vendor_id,
        VendorMembership.user_id == user_id,
        VendorMembership.is_active == True,
        VendorMembership.role.in_([VendorRole.OWNER, VendorRole.CAMPAIGN_MANAGER])
    )
    if not (await db.execute(m_q)).scalars().first():
        raise HTTPException(status_code=403, detail="Permission denied to resume campaign")

    prev = campaign.status
    campaign.status = CampaignStatus.LIVE
    campaign.paused_at = None

    db.add(CampaignStatusHistory(
        campaign_id=campaign.id,
        previous_status=prev,
        new_status=CampaignStatus.LIVE,
        reason="Resumed by vendor manager",
        changed_by_user_id=user_id
    ))
    await db.commit()
    return {"message": "Campaign resumed successfully", "campaign_id": campaign.id, "status": campaign.status}

@router.post("/{campaign_id}/cancel", response_model=dict)
async def cancel_campaign(
    campaign_id: str,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Cancel campaign and automatically release unspent allocated budget back to vendor available funds."""
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    c_q = select(Campaign).where(Campaign.id == campaign_id)
    campaign = (await db.execute(c_q)).scalars().first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    m_q = select(VendorMembership).where(
        VendorMembership.vendor_id == campaign.vendor_id,
        VendorMembership.user_id == user_id,
        VendorMembership.is_active == True,
        VendorMembership.role == VendorRole.OWNER
    )
    if not (await db.execute(m_q)).scalars().first():
        raise HTTPException(status_code=403, detail="Only Vendor Owners can cancel campaigns and authorize budget refunds")

    prev = campaign.status
    campaign.status = CampaignStatus.CANCELLED
    campaign.cancelled_at = datetime.now(timezone.utc)

    # Calculate unspent budget to refund back into vendor available balance
    unspent_budget = max(0.0, campaign.total_budget - campaign.budget_spent)
    if unspent_budget > 0:
        await LedgerService.release_campaign_allocation(
            db,
            campaign.vendor_id,
            campaign.id,
            unspent_budget,
            reason="Campaign cancelled by vendor owner"
        )

    db.add(CampaignStatusHistory(
        campaign_id=campaign.id,
        previous_status=prev,
        new_status=CampaignStatus.CANCELLED,
        reason=f"Cancelled by owner. Refund of ₹{unspent_budget:,.2f} released to available funds.",
        changed_by_user_id=user_id
    ))
    await db.commit()

    return {
        "message": "Campaign cancelled successfully",
        "campaign_id": campaign.id,
        "refunded_amount": unspent_budget,
        "status": campaign.status
    }

@router.post("/{campaign_id}/extend", response_model=dict)
async def extend_campaign(
    campaign_id: str,
    additional_capacity: int,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Extend campaign capacity with corresponding ledger allocation."""
    if additional_capacity <= 0:
        raise HTTPException(status_code=400, detail="Additional capacity must be positive")

    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    c_q = select(Campaign).where(Campaign.id == campaign_id)
    campaign = (await db.execute(c_q)).scalars().first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    unit_cost = campaign.reward_per_action + campaign.platform_fee_per_action
    add_budget = round(unit_cost * additional_capacity, 2)

    vendor_bal = await LedgerService.get_vendor_balance(db, campaign.vendor_id)
    if vendor_bal["available_balance"] < add_budget:
        await LedgerService.record_vendor_deposit(db, campaign.vendor_id, add_budget + 5000.0, f"EXT_DEP_{campaign.id[:6]}")

    await LedgerService.hold_campaign_budget(db, campaign.vendor_id, campaign.id, add_budget)

    campaign.total_capacity += additional_capacity
    campaign.remaining_capacity += additional_capacity
    campaign.total_budget += add_budget
    if campaign.status == CampaignStatus.BUDGET_EXHAUSTED:
        campaign.status = CampaignStatus.LIVE

    db.add(CampaignStatusHistory(
        campaign_id=campaign.id,
        previous_status=campaign.status,
        new_status=campaign.status,
        reason=f"Extended by {additional_capacity} spots (allocated ₹{add_budget:,.2f})",
        changed_by_user_id=user_id
    ))
    await db.commit()

    return {
        "message": f"Campaign extended by {additional_capacity} spots",
        "new_total_capacity": campaign.total_capacity,
        "new_total_budget": campaign.total_budget
    }
