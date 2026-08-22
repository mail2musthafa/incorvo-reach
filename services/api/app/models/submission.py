from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, JSON, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime, timezone
from app.core.database import Base

class SubmissionStatus:
    PENDING_REVIEW = "PENDING_REVIEW"
    UNDER_REVIEW = "UNDER_REVIEW"
    CLARIFICATION_REQUESTED = "CLARIFICATION_REQUESTED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    APPEALED = "APPEALED"
    DISPUTED = "DISPUTED"

class Submission(Base):
    __tablename__ = "submissions"

    assignment_id: Mapped[str] = mapped_column(String(36), ForeignKey("mission_assignments.id", ondelete="CASCADE"), unique=True, nullable=False)
    campaign_id: Mapped[str] = mapped_column(String(36), ForeignKey("campaigns.id", ondelete="CASCADE"), index=True, nullable=False)
    participant_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default=SubmissionStatus.PENDING_REVIEW, index=True, nullable=False)
    risk_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    automated_checks_passed: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Clarification & Appeal Notes
    clarification_request_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    clarification_response_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    appeal_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    appeal_submitted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    assignment: Mapped["MissionAssignment"] = relationship("MissionAssignment", back_populates="submission")
    answers: Mapped[List["SubmissionAnswer"]] = relationship("SubmissionAnswer", back_populates="submission", cascade="all, delete-orphan")
    proof_artifacts: Mapped[List["ProofArtifact"]] = relationship("ProofArtifact", back_populates="submission", cascade="all, delete-orphan")
    decision: Mapped[Optional["VerificationDecision"]] = relationship("VerificationDecision", back_populates="submission", uselist=False, cascade="all, delete-orphan")

class SubmissionAnswer(Base):
    __tablename__ = "submission_answers"

    submission_id: Mapped[str] = mapped_column(String(36), ForeignKey("submissions.id", ondelete="CASCADE"), index=True, nullable=False)
    question_id: Mapped[str] = mapped_column(String(36), ForeignKey("campaign_questions.id", ondelete="CASCADE"), nullable=False)
    answer_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    answer_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True)

    submission: Mapped["Submission"] = relationship("Submission", back_populates="answers")

class ProofArtifact(Base):
    __tablename__ = "proof_artifacts"

    submission_id: Mapped[str] = mapped_column(String(36), ForeignKey("submissions.id", ondelete="CASCADE"), index=True, nullable=False)
    artifact_type: Mapped[str] = mapped_column(String(50), default="IMAGE", nullable=False) # IMAGE, VIDEO, SCREENSHOT, RECEIPT, QR_CODE, FILE, URL
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    mime_type: Mapped[Optional[str]] = mapped_column(String(100), default="image/jpeg", nullable=True)
    perceptual_hash: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    receipt_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True)

    submission: Mapped["Submission"] = relationship("Submission", back_populates="proof_artifacts")

class VerificationDecision(Base):
    __tablename__ = "verification_decisions"

    submission_id: Mapped[str] = mapped_column(String(36), ForeignKey("submissions.id", ondelete="CASCADE"), unique=True, nullable=False)
    decided_by_user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    decision: Mapped[str] = mapped_column(String(32), nullable=False) # APPROVED, REJECTED, CLARIFICATION_REQUESTED
    rejection_reason_code: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    internal_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    participant_feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    decided_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    submission: Mapped["Submission"] = relationship("Submission", back_populates="decision")
