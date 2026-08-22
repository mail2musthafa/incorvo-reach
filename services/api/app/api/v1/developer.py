import secrets
import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.security import decode_token, security_scheme
from app.models.developer import ApiKey, WebhookSubscription, WebhookDeliveryLog
from app.models.vendor import VendorMembership
from pydantic import BaseModel

router = APIRouter(prefix="/developer", tags=["Developer & Webhook Ecosystem"])

class CreateApiKeyRequest(BaseModel):
    name: str

class CreateApiKeyResponse(BaseModel):
    id: str
    name: str
    key_prefix: str
    plain_secret_key: str
    message: str = "Store this secret safely. You will not be able to view it again."

class CreateWebhookRequest(BaseModel):
    target_url: str
    event_types: List[str] # ["submission.approved", "lead.generated", "payout.completed"]

@router.post("/keys", response_model=CreateApiKeyResponse, status_code=status.HTTP_201_CREATED)
async def generate_api_key(
    data: CreateApiKeyRequest,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    m_q = select(VendorMembership).where(VendorMembership.user_id == user_id, VendorMembership.is_active == True)
    membership = (await db.execute(m_q)).scalars().first()
    if not membership:
        raise HTTPException(status_code=403, detail="Vendor organization required")

    prefix = "inc_" + secrets.token_hex(4)
    raw_secret = secrets.token_urlsafe(32)
    full_key = f"{prefix}_{raw_secret}"
    hashed = hashlib.sha256(full_key.encode()).hexdigest()

    key_record = ApiKey(
        vendor_id=membership.vendor_id,
        name=data.name,
        key_prefix=prefix,
        hashed_secret=hashed
    )
    db.add(key_record)
    await db.commit()

    return CreateApiKeyResponse(
        id=key_record.id,
        name=key_record.name,
        key_prefix=prefix,
        plain_secret_key=full_key
    )

@router.get("/keys", response_model=List[Dict[str, Any]])
async def list_api_keys(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    m_q = select(VendorMembership).where(VendorMembership.user_id == user_id, VendorMembership.is_active == True)
    membership = (await db.execute(m_q)).scalars().first()
    if not membership:
        raise HTTPException(status_code=403, detail="Vendor organization required")

    keys = (await db.execute(select(ApiKey).where(ApiKey.vendor_id == membership.vendor_id))).scalars().all()
    return [{
        "id": k.id,
        "name": k.name,
        "key_prefix": k.key_prefix,
        "is_active": k.is_active,
        "created_at": k.created_at.isoformat()
    } for k in keys]

@router.post("/webhooks", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_webhook_subscription(
    data: CreateWebhookRequest,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    m_q = select(VendorMembership).where(VendorMembership.user_id == user_id, VendorMembership.is_active == True)
    membership = (await db.execute(m_q)).scalars().first()
    if not membership:
        raise HTTPException(status_code=403, detail="Vendor organization required")

    secret = "whsec_" + secrets.token_hex(24)
    sub = WebhookSubscription(
        vendor_id=membership.vendor_id,
        target_url=data.target_url,
        secret_token=secret,
        event_types_json=data.event_types
    )
    db.add(sub)
    await db.commit()

    return {
        "id": sub.id,
        "target_url": sub.target_url,
        "secret_token": secret,
        "event_types": data.event_types,
        "message": "Webhook subscription created successfully"
    }

@router.get("/webhooks", response_model=List[Dict[str, Any]])
async def list_webhook_subscriptions(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    m_q = select(VendorMembership).where(VendorMembership.user_id == user_id, VendorMembership.is_active == True)
    membership = (await db.execute(m_q)).scalars().first()
    if not membership:
        raise HTTPException(status_code=403, detail="Vendor organization required")

    subs = (await db.execute(select(WebhookSubscription).where(WebhookSubscription.vendor_id == membership.vendor_id))).scalars().all()
    return [{
        "id": s.id,
        "target_url": s.target_url,
        "event_types": s.event_types_json,
        "is_active": s.is_active,
        "created_at": s.created_at.isoformat()
    } for s in subs]
