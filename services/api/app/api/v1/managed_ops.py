from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, List
from app.core.security import decode_token, security_scheme
from pydantic import BaseModel

router = APIRouter(prefix="/managed-ops", tags=["Managed Campaign Operations"])

class RequestManagedCampaign(BaseModel):
    objective: str
    target_budget_inr: float
    target_category: str
    timeline_days: int = 14
    notes: str

@router.post("/request", response_model=dict, status_code=status.HTTP_201_CREATED)
async def request_managed_campaign(
    data: RequestManagedCampaign,
    auth=Depends(security_scheme)
):
    """Request Incorvo's dedicated operations team to build, moderate, and execute a white-glove campaign."""
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")

    return {
        "status": "REQUEST_LOGGED",
        "request_id": f"mng_{data.target_category.lower()}_9921",
        "assigned_lead": "Incorvo Campaign Operations Principal",
        "message": f"White-glove request of ₹{data.target_budget_inr:,.2f} registered. A campaign manager will deliver a custom brief within 4 business hours."
    }
