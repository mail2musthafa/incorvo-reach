from sqlalchemy import String, Float, ForeignKey, JSON, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from app.core.database import Base

class FraudEvent(Base):
    __tablename__ = "fraud_events"

    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=True)
    campaign_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("campaigns.id"), nullable=True)
    submission_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("submissions.id"), nullable=True)
    rule_triggered: Mapped[str] = mapped_column(String(100), index=True, nullable=False) # e.g. DUPLICATE_IMAGE_HASH, IMPOSSIBLE_COMPLETION_SPEED, IP_VELOCITY
    risk_severity: Mapped[str] = mapped_column(String(32), default="MEDIUM", nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    risk_score_delta: Mapped[float] = mapped_column(Float, default=0.5, nullable=False)
    details_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True)
    is_reviewed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    action_taken: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
