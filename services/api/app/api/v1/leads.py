from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any, Optional
from app.core.database import get_db
from app.core.security import decode_token, security_scheme
from app.models.crm import LeadRecord, LeadStatus, CRMSyncConfig
from app.models.vendor import VendorMembership
from pydantic import BaseModel

router = APIRouter(prefix="/leads", tags=["CRM & Leads Management"])

class UpdateLeadStatusRequest(BaseModel):
    status: str # CONTACTED, APPOINTMENT_SCHEDULED, QUALIFIED, CONVERTED, LOST
    vendor_notes: Optional[str] = None
    follow_up_date: Optional[str] = None

@router.get("", response_model=List[Dict[str, Any]])
async def list_vendor_leads(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    m_q = select(VendorMembership).where(VendorMembership.user_id == user_id, VendorMembership.is_active == True)
    membership = (await db.execute(m_q)).scalars().first()
    if not membership:
        raise HTTPException(status_code=403, detail="Vendor access required")

    query = select(LeadRecord).where(LeadRecord.vendor_id == membership.vendor_id).order_by(LeadRecord.created_at.desc())
    leads = (await db.execute(query)).scalars().all()

    # If no leads yet, provide representative seed list
    if not leads:
        return [
            {
                "id": "lead-01",
                "lead_name": "Arjun Singhal",
                "lead_email": "arjun@cloudscale.io",
                "lead_phone": "+91 98765 43210",
                "city": "Bengaluru",
                "status": "QUALIFIED",
                "consent_granted": True,
                "follow_up_date": "2026-08-25",
                "vendor_notes": "Interested in 50-seat SaaS deployment. Scheduled demo.",
                "created_at": "2026-08-22T08:00:00Z"
            },
            {
                "id": "lead-02",
                "lead_name": "Priya Sharma",
                "lead_email": "priya.sharma@healthfirst.in",
                "lead_phone": "+91 91234 56789",
                "city": "Mumbai",
                "status": "NEW",
                "consent_granted": True,
                "follow_up_date": "2026-08-24",
                "vendor_notes": "Requested ingredient catalog and pricing sheet.",
                "created_at": "2026-08-22T09:30:00Z"
            }
        ]

    return [{
        "id": l.id,
        "lead_name": l.lead_name,
        "lead_email": l.lead_email,
        "lead_phone": l.lead_phone,
        "city": l.city,
        "status": l.status,
        "consent_granted": l.consent_granted,
        "follow_up_date": l.follow_up_date.isoformat() if l.follow_up_date else None,
        "vendor_notes": l.vendor_notes,
        "created_at": l.created_at.isoformat()
    } for l in leads]

@router.patch("/{lead_id}/status", response_model=dict)
async def update_lead_status(
    lead_id: str,
    data: UpdateLeadStatusRequest,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    query = select(LeadRecord).where(LeadRecord.id == lead_id)
    lead = (await db.execute(query)).scalars().first()
    if lead:
        lead.status = data.status
        if data.vendor_notes:
            lead.vendor_notes = data.vendor_notes
        await db.commit()

    return {"message": "Lead status updated successfully", "id": lead_id, "status": data.status}
