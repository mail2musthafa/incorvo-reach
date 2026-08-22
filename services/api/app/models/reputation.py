from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime, timezone
from app.core.database import Base

class ParticipantTier:
    BRONZE = "BRONZE"
    SILVER = "SILVER"
    GOLD = "GOLD"
    PLATINUM = "PLATINUM"
    ENTERPRISE_PANEL = "ENTERPRISE_PANEL"

class ParticipantReputation(Base):
    __tablename__ = "participant_reputations"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    reliability_score: Mapped[float] = mapped_column(Float, default=95.0, nullable=False) # 0.0 to 100.0
    tier: Mapped[str] = mapped_column(String(32), default=ParticipantTier.BRONZE, index=True, nullable=False)
    
    total_completed_missions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_approved_missions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_rejected_missions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_disputes_won: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    high_value_eligible: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    category_expertise_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True) # {"BEAUTY": 5, "TECH": 12, "FINANCE": 8}
    badges_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True) # ["VERIFIED_CREATOR", "SPEED_THOROUGH", "UGC_MASTER"]
    last_evaluated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user: Mapped["User"] = relationship("User")
