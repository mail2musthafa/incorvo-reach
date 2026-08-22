from sqlalchemy import String, Integer, Boolean, ForeignKey, JSON, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime, timezone
from app.core.database import Base

class ApiKey(Base):
    __tablename__ = "api_keys"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    key_prefix: Mapped[str] = mapped_column(String(16), nullable=False)
    hashed_secret: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    permissions_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)
    last_used_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

class WebhookSubscription(Base):
    __tablename__ = "webhook_subscriptions"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    target_url: Mapped[str] = mapped_column(String(500), nullable=False)
    secret_token: Mapped[str] = mapped_column(String(100), nullable=False)
    event_types_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=False) # e.g. ["submission.approved", "lead.generated", "payout.completed"]
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    delivery_logs: Mapped[List["WebhookDeliveryLog"]] = relationship("WebhookDeliveryLog", back_populates="subscription", cascade="all, delete-orphan")

class WebhookDeliveryLog(Base):
    __tablename__ = "webhook_delivery_logs"

    subscription_id: Mapped[str] = mapped_column(String(36), ForeignKey("webhook_subscriptions.id", ondelete="CASCADE"), index=True, nullable=False)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)
    payload_json: Mapped[dict] = mapped_column(JSON, nullable=False)
    response_status_code: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    response_body: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_successful: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    attempt_number: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    delivered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    subscription: Mapped["WebhookSubscription"] = relationship("WebhookSubscription", back_populates="delivery_logs")
