from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.security import decode_token, security_scheme
from app.models.notification import Notification, NotificationPreference

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[Dict[str, Any]])
async def list_user_notifications(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    query = select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc())
    notifications = (await db.execute(query)).scalars().all()
    return [{
        "id": n.id,
        "title": n.title,
        "message": n.message,
        "notification_type": n.notification_type,
        "is_read": n.is_read,
        "action_url": n.action_url,
        "created_at": n.created_at.isoformat()
    } for n in notifications]

@router.post("/{notification_id}/read", response_model=dict)
async def mark_notification_as_read(
    notification_id: str,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    query = select(Notification).where(Notification.id == notification_id, Notification.user_id == user_id)
    notif = (await db.execute(query)).scalars().first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.is_read = True
    await db.commit()
    return {"message": "Notification marked as read", "id": notification_id}

@router.get("/preferences", response_model=Dict[str, Any])
async def get_notification_preferences(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    query = select(NotificationPreference).where(NotificationPreference.user_id == user_id)
    pref = (await db.execute(query)).scalars().first()
    if not pref:
        pref = NotificationPreference(user_id=user_id, email_enabled=True, sms_enabled=True, whatsapp_enabled=False, in_app_enabled=True)
        db.add(pref)
        await db.commit()

    return {
        "email_enabled": pref.email_enabled,
        "sms_enabled": pref.sms_enabled,
        "whatsapp_enabled": pref.whatsapp_enabled,
        "in_app_enabled": pref.in_app_enabled
    }
