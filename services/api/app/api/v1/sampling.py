from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.security import decode_token, security_scheme
from app.models.sampling import SampleProduct, SampleDispatchBatch, SampleShipment
from app.models.vendor import VendorMembership
from pydantic import BaseModel

router = APIRouter(prefix="/sampling", tags=["Sampling Operations"])

class AddSampleProductRequest(BaseModel):
    name: str
    sku: str
    weight_grams: float
    unit_cost_inr: float
    stock_quantity: int

@router.get("/inventory", response_model=List[Dict[str, Any]])
async def list_sample_inventory(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    return [
        {
            "id": "samp-101",
            "name": "Nova Organic Almond Fudge Protein Bar (50g)",
            "sku": "NOVA-BAR-ALM-50G",
            "weight_grams": 50.0,
            "unit_cost_inr": 45.0,
            "stock_quantity": 450,
            "allocated_quantity": 97
        },
        {
            "id": "samp-102",
            "name": "Nova Ceremonial Japanese Matcha Tin (30g)",
            "sku": "NOVA-MATCHA-CER-30G",
            "weight_grams": 30.0,
            "unit_cost_inr": 280.0,
            "stock_quantity": 180,
            "allocated_quantity": 25
        }
    ]

@router.get("/batches", response_model=List[Dict[str, Any]])
async def list_dispatch_batches(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    return [
        {
            "id": "batch-01",
            "batch_reference": "DISP_2026_AUG_NOVA_01",
            "courier_partner": "DELHIVERY_EXPRESS",
            "total_units": 50,
            "status": "IN_TRANSIT",
            "created_at": "2026-08-21T09:00:00Z"
        }
    ]
