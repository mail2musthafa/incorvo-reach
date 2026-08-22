from sqlalchemy import String, ForeignKey, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    actor_user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=True)
    action: Mapped[str] = mapped_column(String(100), index=True, nullable=False) # e.g. CAMPAIGN_STATUS_CHANGE, VENDOR_VERIFIED, PAYOUT_APPROVED
    resource_type: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    resource_id: Mapped[str] = mapped_column(String(36), index=True, nullable=False)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    changes_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
