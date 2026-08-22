from sqlalchemy import String, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from app.core.database import Base

class DisputeStatus:
    OPEN = "OPEN"
    UNDER_INVESTIGATION = "UNDER_INVESTIGATION"
    RESOLVED_PARTICIPANT_FAVOUR = "RESOLVED_PARTICIPANT_FAVOUR"
    RESOLVED_VENDOR_FAVOUR = "RESOLVED_VENDOR_FAVOUR"
    CLOSED = "CLOSED"

class Dispute(Base):
    __tablename__ = "disputes"

    submission_id: Mapped[str] = mapped_column(String(36), ForeignKey("submissions.id"), index=True, nullable=False)
    raised_by_user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    target_vendor_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("vendor_organisations.id"), nullable=True)
    dispute_reason: Mapped[str] = mapped_column(String(100), nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_urls: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default=DisputeStatus.OPEN, index=True, nullable=False)
    resolution_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assigned_moderator_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)

    messages: Mapped[List["DisputeMessage"]] = relationship("DisputeMessage", back_populates="dispute", cascade="all, delete-orphan")

class DisputeMessage(Base):
    __tablename__ = "dispute_messages"

    dispute_id: Mapped[str] = mapped_column(String(36), ForeignKey("disputes.id", ondelete="CASCADE"), index=True, nullable=False)
    sender_user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    message_text: Mapped[str] = mapped_column(Text, nullable=False)
    attachments_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)

    dispute: Mapped["Dispute"] = relationship("Dispute", back_populates="messages")
