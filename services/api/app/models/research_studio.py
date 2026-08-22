from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, JSON, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime, timezone
from app.core.database import Base

class ResearchSession(Base):
    __tablename__ = "research_sessions"

    campaign_id: Mapped[str] = mapped_column(String(36), ForeignKey("campaigns.id", ondelete="CASCADE"), index=True, nullable=False)
    participant_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    session_type: Mapped[str] = mapped_column(String(50), default="UNMODERATED_RECORDING", nullable=False) # UNMODERATED_RECORDING, LIVE_INTERVIEW, USABILITY_TEST
    status: Mapped[str] = mapped_column(String(32), default="SCHEDULED", index=True, nullable=False) # SCHEDULED, LIVE, PROCESSING, COMPLETED, CANCELLED
    
    recording_video_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    recording_screen_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    recording_audio_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    transcript_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sentiment_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False) # -1.0 to 1.0
    key_themes_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)
    researcher_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    scheduled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    highlights: Mapped[List["HighlightClip"]] = relationship("HighlightClip", back_populates="session", cascade="all, delete-orphan")

class InterviewRoom(Base):
    __tablename__ = "interview_rooms"

    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("research_sessions.id", ondelete="CASCADE"), unique=True, nullable=False)
    room_code: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    moderator_token: Mapped[str] = mapped_column(String(128), nullable=False)
    participant_token: Mapped[str] = mapped_column(String(128), nullable=False)
    is_live: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

class HighlightClip(Base):
    __tablename__ = "highlight_clips"

    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("research_sessions.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    start_time_seconds: Mapped[int] = mapped_column(Integer, nullable=False)
    end_time_seconds: Mapped[int] = mapped_column(Integer, nullable=False)
    clip_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    tag: Mapped[str] = mapped_column(String(100), default="UX_FRICTION", nullable=False)
    quote_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    session: Mapped["ResearchSession"] = relationship("ResearchSession", back_populates="highlights")

class StudyRepository(Base):
    __tablename__ = "study_repositories"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    hypothesis: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    executive_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    methodology: Mapped[str] = mapped_column(String(100), default="MIXED_METHODS", nullable=False)
    tags_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)
    sessions_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
