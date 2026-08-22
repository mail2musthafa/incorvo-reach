from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, JSON, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime, timezone
from app.core.database import Base

class PartnerProfile(Base):
    __tablename__ = "partner_profiles"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    partner_type: Mapped[str] = mapped_column(String(50), default="AFFILIATE_CREATOR", nullable=False) # AFFILIATE_CREATOR, MEDIA_PUBLISHER, ENTERPRISE_RESELLER
    company_name: Optional[Mapped[str]] = mapped_column(String(255), nullable=True)
    website_or_channel: Mapped[str] = mapped_column(String(500), nullable=False)
    monthly_traffic_estimate: Mapped[int] = mapped_column(Integer, default=10000, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="ACTIVE", nullable=False)

class PartnerContract(Base):
    __tablename__ = "partner_contracts"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    partner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    commission_type: Mapped[str] = mapped_column(String(50), default="PERCENT_CPS", nullable=False) # FIXED_CPA, PERCENT_CPS, RECURRING_REV_SHARE
    commission_rate: Mapped[float] = mapped_column(Float, default=10.0, nullable=False) # e.g. 10% or ₹500
    cookie_window_days: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    recurring_months_limit: Mapped[int] = mapped_column(Integer, default=12, nullable=False)
    is_signed: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    signed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class PartnerDeepLink(Base):
    __tablename__ = "partner_deep_links"

    partner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    campaign_id: Mapped[str] = mapped_column(String(36), ForeignKey("campaigns.id", ondelete="CASCADE"), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    destination_url: Mapped[str] = mapped_column(String(500), nullable=False)
    clicks_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    conversions_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_commission_earned_inr: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
