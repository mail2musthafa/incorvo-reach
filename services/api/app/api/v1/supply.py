from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from app.core.security import decode_token, security_scheme

router = APIRouter(prefix="/supply", tags=["Participant Supply Management"])

@router.get("/coverage", response_model=List[Dict[str, Any]])
async def get_regional_supply_coverage(
    auth=Depends(security_scheme)
):
    """Regional participant supply density across Tier 1, 2, and 3 Indian metros."""
    return [
        {"city": "Bengaluru", "active_participants": 245, "gold_tier_creators": 68, "verified_reviewers": 190, "fulfillment_rate_percent": 99.1},
        {"city": "Mumbai", "active_participants": 210, "gold_tier_creators": 54, "verified_reviewers": 165, "fulfillment_rate_percent": 98.6},
        {"city": "Delhi NCR", "active_participants": 195, "gold_tier_creators": 48, "verified_reviewers": 150, "fulfillment_rate_percent": 97.9},
        {"city": "Hyderabad", "active_participants": 130, "gold_tier_creators": 32, "verified_reviewers": 98, "fulfillment_rate_percent": 99.4},
        {"city": "Pune", "active_participants": 115, "gold_tier_creators": 28, "verified_reviewers": 85, "fulfillment_rate_percent": 98.9},
        {"city": "Chennai", "active_participants": 110, "gold_tier_creators": 26, "verified_reviewers": 82, "fulfillment_rate_percent": 98.2}
    ]
