from sqlalchemy import String, Integer, ForeignKey, JSON, DateTime, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from datetime import datetime, timezone
from app.core.database import Base

class MissionStatus:
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    IN_PROGRESS = "IN_PROGRESS"
    SUBMITTED = "SUBMITTED"
    AUTOMATED_CHECK = "AUTOMATED_CHECK"
    MANUAL_REVIEW = "MANUAL_REVIEW"
    CLARIFICATION_REQUESTED = "CLARIFICATION_REQUESTED"
    APPROVED = "APPROVED"
    REWARDED = "REWARDED"
    REJECTED = "REJECTED"
    DISPUTED = "DISPUTED"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"

class MissionAssignment(Base):
    __tablename__ = "mission_assignments"

    campaign_id: Mapped[str] = mapped_column(String(36), ForeignKey("campaigns.id", ondelete="CASCADE"), index=True, nullable=False)
    participant_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default=MissionStatus.RESERVED, index=True, nullable=False)
    
    attempts_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    max_attempts: Mapped[int] = mapped_column(Integer, default=2, nullable=False)
    
    reserved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    clarification_deadline: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    submitted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    campaign: Mapped["Campaign"] = relationship("Campaign", back_populates="assignments")
    participant: Mapped["User"] = relationship("User", back_populates="assignments")
    submission: Mapped[Optional["Submission"]] = relationship("Submission", back_populates="assignment", uselist=False, cascade="all, delete-orphan")
    progress: Mapped[Optional["MissionProgress"]] = relationship("MissionProgress", back_populates="assignment", uselist=False, cascade="all, delete-orphan")

class MissionProgress(Base):
    __tablename__ = "mission_progress"

    assignment_id: Mapped[str] = mapped_column(String(36), ForeignKey("mission_assignments.id", ondelete="CASCADE"), unique=True, nullable=False)
    current_step: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    step_data_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True)
    last_saved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    assignment: Mapped["MissionAssignment"] = relationship("MissionAssignment", back_populates="progress")
