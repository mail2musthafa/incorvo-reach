from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.security import decode_token, security_scheme

router = APIRouter(prefix="/sales-enablement", tags=["Sales Enablement"])

@router.get("/courses", response_model=List[Dict[str, Any]])
async def list_training_courses(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    return [
        {
            "id": "course-01",
            "title": "NovaHealth Clean Nutrition & Ingredient Certification",
            "description": "Learn clean-label benefits, stevia-free formulations, and objection handling for retail customer inquiries.",
            "passing_score_percent": 80,
            "estimated_duration_minutes": 15,
            "certified_participants_count": 84,
            "reward_upon_certification_inr": 250.0
        },
        {
            "id": "course-02",
            "title": "Zenith Cloud SaaS Demo Qualification Masterclass",
            "description": "Master B2B tech discovery questions, ICP identification, and enterprise security compliance talk tracks.",
            "passing_score_percent": 85,
            "estimated_duration_minutes": 25,
            "certified_participants_count": 32,
            "reward_upon_certification_inr": 500.0
        }
    ]

@router.get("/scripts", response_model=List[Dict[str, Any]])
async def list_sales_scripts(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    return [
        {
            "id": "script-01",
            "product_name": "Nova Almond Fudge Clean Protein Bar",
            "opening_hook": "Hi! Are you looking for a clean afternoon energy boost without any artificial sweetener aftertaste?",
            "key_value_props": ["15g Grass-fed Whey", "Zero Stevia / Zero Sucralose", "Monk fruit sweetened", "Gluten Free"],
            "common_objections": {
                "Is it too sweet?": "No, monk fruit delivers a balanced subtle chocolate taste with zero lingering sweetness.",
                "How does it compare to standard bars?": "Standard bars use maltitol or sucralose which cause bloating; our formula is 100% gut-friendly."
            },
            "closing_cta": "Would you like to try a single bar today or grab the 6-pack with free express shipping?"
        }
    ]
