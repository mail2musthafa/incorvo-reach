from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from app.core.security import decode_token, security_scheme

router = APIRouter(prefix="/benchmarks", tags=["Industry Benchmarks & Intelligence"])

@router.get("/categories", response_model=List[Dict[str, Any]])
async def get_industry_benchmarks(
    auth=Depends(security_scheme)
):
    """Industry category benchmark averages for CPVA, approval rates, and completion velocity."""
    return [
        {
            "industry": "D2C Health & Wellness",
            "avg_cpva_inr": 185.0,
            "avg_approval_rate_percent": 94.2,
            "avg_completion_minutes": 9.5,
            "avg_ugc_retention_sec": 24.5,
            "top_quartile_cvr_percent": 11.4
        },
        {
            "industry": "B2B SaaS & Enterprise",
            "avg_cpva_inr": 420.0,
            "avg_approval_rate_percent": 91.8,
            "avg_completion_minutes": 18.2,
            "avg_lead_to_demo_cvr_percent": 16.5,
            "top_quartile_cvr_percent": 24.0
        },
        {
            "industry": "Clean Beauty & Personal Care",
            "avg_cpva_inr": 160.0,
            "avg_approval_rate_percent": 96.1,
            "avg_completion_minutes": 8.0,
            "avg_ugc_retention_sec": 28.0,
            "top_quartile_cvr_percent": 14.2
        },
        {
            "industry": "Offline Retail & Grocery",
            "avg_cpva_inr": 220.0,
            "avg_approval_rate_percent": 95.0,
            "avg_completion_minutes": 14.0,
            "avg_shelf_audit_accuracy_percent": 97.4,
            "top_quartile_cvr_percent": 18.0
        }
    ]
