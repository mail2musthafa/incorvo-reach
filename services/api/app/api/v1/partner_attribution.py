from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.security import decode_token, security_scheme

router = APIRouter(prefix="/partner-attribution", tags=["Partner & Attribution"])

@router.get("/partners", response_model=List[Dict[str, Any]])
async def list_partners(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    return [
        {
            "id": "part-01",
            "partner_name": "Kavita Patel Media",
            "partner_type": "AFFILIATE_CREATOR",
            "commission_structure": "12% Percent of Verified Sale (CPS)",
            "cookie_window_days": 30,
            "total_clicks": 3450,
            "conversions": 182,
            "total_earned_inr": 45500.0,
            "status": "ACTIVE_VERIFIED"
        }
    ]

@router.get("/links", response_model=List[Dict[str, Any]])
async def list_deep_links(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    return [
        {
            "id": "link-101",
            "slug": "kavita-matcha-special",
            "destination_url": "https://novahealth.in/products/ceremonial-matcha",
            "tracking_url": "https://reach.incorvo.in/r/kavita-matcha-special",
            "clicks": 1280,
            "conversions": 94,
            "conversion_rate_percent": 7.34
        }
    ]
