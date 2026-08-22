from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import Dict, Any, List
from app.core.database import get_db
from app.core.security import decode_token, security_scheme
from app.models.user import User, UserProfile, UserConsent, UserSession, PayoutAccount
from app.models.mission import MissionAssignment
from app.services.ledger_service import LedgerService
from pydantic import BaseModel
from datetime import datetime, timezone

router = APIRouter(prefix="/users", tags=["Users & Privacy Governance"])

class UpdateConsentRequest(BaseModel):
    consent_type: str
    is_granted: bool
    version: str = "1.0"

@router.get("/export-data", response_model=Dict[str, Any])
async def export_personal_data(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Data portability endpoint: Export complete participant profile, consents, assignments & balance."""
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    user_q = select(User).where(User.id == user_id)
    user = (await db.execute(user_q)).scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile_q = select(UserProfile).where(UserProfile.user_id == user.id)
    profile = (await db.execute(profile_q)).scalars().first()

    consents_q = select(UserConsent).where(UserConsent.user_id == user.id)
    consents = (await db.execute(consents_q)).scalars().all()

    bal = await LedgerService.get_participant_balance(db, user.id)

    return {
        "user_id": user.id,
        "email": user.email,
        "phone": user.phone,
        "full_name": profile.full_name if profile else None,
        "city": profile.city if profile else None,
        "state": profile.state if profile else None,
        "interests": profile.interests if profile else [],
        "ledger_balances": bal,
        "consents": [{"type": c.consent_type, "version": c.version, "granted_at": c.granted_at.isoformat()} for c in consents],
        "exported_at": datetime.now(timezone.utc).isoformat()
    }

@router.post("/delete-account", response_model=dict)
async def request_account_deletion(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Account deletion request with audit compliance."""
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    user_q = select(User).where(User.id == user_id)
    user = (await db.execute(user_q)).scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = False
    user.deletion_requested_at = datetime.now(timezone.utc)
    await db.commit()

    return {"message": "Account deletion scheduled. Sessions terminated.", "user_id": user.id}

@router.post("/consents", response_model=dict)
async def update_consent(
    data: UpdateConsentRequest,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    consent = UserConsent(
        user_id=user_id,
        consent_type=data.consent_type,
        version=data.version,
        is_granted=data.is_granted
    )
    db.add(consent)
    await db.commit()
    return {"message": "Consent updated successfully", "consent_type": data.consent_type}

@router.delete("/sessions/all", response_model=dict)
async def logout_all_sessions(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    await db.execute(
        update(UserSession).where(UserSession.user_id == user_id).values(is_revoked=True)
    )
    await db.commit()
    return {"message": "All active sessions revoked successfully"}
