from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any, Optional
from app.core.database import get_db
from app.core.security import decode_token, security_scheme
from app.models.research_studio import ResearchSession, InterviewRoom, HighlightClip, StudyRepository
from app.models.vendor import VendorMembership
from pydantic import BaseModel

router = APIRouter(prefix="/research-studio", tags=["Research Studio"])

class CreateStudyRequest(BaseModel):
    title: str
    hypothesis: Optional[str] = None
    executive_summary: Optional[str] = None
    methodology: str = "MIXED_METHODS"
    tags: Optional[List[str]] = []

@router.get("/studies", response_model=List[Dict[str, Any]])
async def list_studies(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    m_q = select(VendorMembership).where(VendorMembership.user_id == user_id, VendorMembership.is_active == True)
    membership = (await db.execute(m_q)).scalars().first()
    if not membership:
        raise HTTPException(status_code=403, detail="Vendor organization required")

    studies = (await db.execute(select(StudyRepository).where(StudyRepository.vendor_id == membership.vendor_id))).scalars().all()
    if not studies:
        return [
            {
                "id": "study-01",
                "title": "Clean-Label Plant Protein Taste & Texture Usability Study",
                "hypothesis": "Consumers prefer monk fruit sweetness over stevia by a 3:1 ratio.",
                "methodology": "MODERATED_INTERVIEWS",
                "tags": ["D2C", "Taste-Test", "Packaging"],
                "sessions_count": 8,
                "created_at": "2026-08-20T10:00:00Z"
            }
        ]

    return [{
        "id": s.id,
        "title": s.title,
        "hypothesis": s.hypothesis,
        "methodology": s.methodology,
        "tags": s.tags_json,
        "sessions_count": s.sessions_count,
        "created_at": s.created_at.isoformat()
    } for s in studies]

@router.get("/sessions", response_model=List[Dict[str, Any]])
async def list_research_sessions(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    return [
        {
            "id": "rs-001",
            "participant_name": "Ananya Iyer",
            "session_type": "LIVE_INTERVIEW",
            "status": "COMPLETED",
            "duration_seconds": 1320,
            "sentiment_score": 0.85,
            "key_themes": ["Clean Finish", "Chewy Consistency", "Premium Box"],
            "recording_video_url": "https://cdn.reach.incorvo.in/research/session_001.mp4",
            "transcript_summary": "Participant noted exceptional mouthfeel without stevia aftertaste. Requested smaller pocket-sized snack packs.",
            "completed_at": "2026-08-21T14:30:00Z"
        }
    ]
