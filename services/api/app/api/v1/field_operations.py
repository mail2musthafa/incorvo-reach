from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.security import decode_token, security_scheme

router = APIRouter(prefix="/field-operations", tags=["Field Operations"])

@router.get("/stores", response_model=List[Dict[str, Any]])
async def list_store_master(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    return [
        {
            "id": "st-001",
            "store_code": "NOVA-BLR-01",
            "store_name": "Nova Flagship Experience Lounge",
            "retail_chain": "COMPANY_OWNED",
            "city": "Bengaluru",
            "address": "100ft Road, Indiranagar",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "geofence_radius_meters": 150,
            "qr_token": "QR_BLR_INDIRA_9921",
            "is_active": True
        },
        {
            "id": "st-002",
            "store_code": "REL-RET-MUM-44",
            "store_name": "Reliance Signature Gourmet Bandra",
            "retail_chain": "RELIANCE_RETAIL",
            "city": "Mumbai",
            "address": "Hill Road, Bandra West",
            "latitude": 19.0596,
            "longitude": 72.8295,
            "geofence_radius_meters": 100,
            "qr_token": "QR_MUM_BANDRA_4412",
            "is_active": True
        }
    ]

@router.get("/corrective-actions", response_model=List[Dict[str, Any]])
async def list_corrective_actions(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    return [
        {
            "id": "ca-101",
            "store_name": "Reliance Signature Gourmet Bandra",
            "issue_type": "OUT_OF_STOCK",
            "description": "Ceremonial Matcha 30g tin shelf facing empty during mystery audit.",
            "status": "ASSIGNED_TO_DISTRIBUTOR",
            "created_at": "2026-08-22T08:30:00Z"
        }
    ]
