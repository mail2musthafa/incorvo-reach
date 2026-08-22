from fastapi import APIRouter
from app.core.config import settings
from datetime import datetime, timezone

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "parent_company": settings.PARENT_COMPANY,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
