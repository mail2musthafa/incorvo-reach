from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.security import decode_token, security_scheme

router = APIRouter(prefix="/content-studio", tags=["Content Studio"])

@router.get("/creators", response_model=List[Dict[str, Any]])
async def list_creator_network(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    return [
        {
            "id": "cr-01",
            "handle": "@ananya_health",
            "name": "Ananya Iyer",
            "niches": ["Wellness", "Nutrition", "Morning Routines"],
            "standard_rate_ugc_inr": 1500.0,
            "completed_ugc_campaigns": 8,
            "quality_rating": 4.95,
            "camera_gear": "iPhone 15 Pro 4K60 + DJI Mic 2"
        },
        {
            "id": "cr-02",
            "handle": "@rohit_techreviews",
            "name": "Rohit Verma",
            "niches": ["B2B SaaS", "Tech Gadgets", "Workflow Productivity"],
            "standard_rate_ugc_inr": 2000.0,
            "completed_ugc_campaigns": 12,
            "quality_rating": 4.90,
            "camera_gear": "Sony A7 IV + Shure SM7B"
        }
    ]

@router.get("/contracts", response_model=List[Dict[str, Any]])
async def list_rights_contracts(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    return [
        {
            "id": "rc-001",
            "creator_name": "Ananya Iyer",
            "campaign_title": "Original Morning Routine UGC Video with Nova Matcha",
            "license_type": "COMMERCIAL_DIGITAL_FULL (PAID ADS ALLOWED)",
            "duration": "12 Months (Exp: August 2027)",
            "geographic_scope": "Worldwide Digital Channels",
            "status": "ACTIVE_LICENSED"
        }
    ]
