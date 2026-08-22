from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, JSON, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime, timezone
from app.core.database import Base

class CreatorProfile(Base):
    __tablename__ = "creator_profiles"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    handle: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    portfolio_links_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)
    primary_niches_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True) # ["BEAUTY", "TECH", "FITNESS"]
    standard_rate_ugc_inr: Mapped[float] = mapped_column(Float, default=1500.0, nullable=False)
    camera_gear: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_exclusive: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

class CreativeBrief(Base):
    __tablename__ = "creative_briefs"

    campaign_id: Mapped[str] = mapped_column(String(36), ForeignKey("campaigns.id", ondelete="CASCADE"), unique=True, nullable=False)
    deliverable_format: Mapped[str] = mapped_column(String(50), default="VERTICAL_VIDEO_9_16", nullable=False)
    hook_requirements: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    do_list_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)
    dont_list_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)
    aspect_ratio: Mapped[str] = mapped_column(String(20), default="9:16", nullable=False)
    min_resolution: Mapped[str] = mapped_column(String(50), default="1080x1920", nullable=False)
    allow_revisions_count: Mapped[int] = mapped_column(Integer, default=2, nullable=False)

class ContentRevision(Base):
    __tablename__ = "content_revisions"

    submission_id: Mapped[str] = mapped_column(String(36), ForeignKey("submissions.id", ondelete="CASCADE"), index=True, nullable=False)
    revision_number: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    creator_asset_url: Mapped[str] = mapped_column(String(500), nullable=False)
    creator_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    vendor_feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="PENDING_REVIEW", nullable=False) # PENDING_REVIEW, CHANGES_REQUESTED, APPROVED

class RightsContract(Base):
    __tablename__ = "rights_contracts"

    submission_id: Mapped[str] = mapped_column(String(36), ForeignKey("submissions.id", ondelete="CASCADE"), unique=True, nullable=False)
    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id"), index=True, nullable=False)
    creator_user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    license_type: Mapped[str] = mapped_column(String(50), default="COMMERCIAL_DIGITAL_FULL", nullable=False) # ORGANIC_ONLY, PAID_ADS_ALLOWED, FULL_BUYOUT
    duration_months: Mapped[int] = mapped_column(Integer, default=12, nullable=False) # 12, 24, or 0 (Perpetual)
    geographic_scope: Mapped[str] = mapped_column(String(100), default="WORLDWIDE", nullable=False)
    agreed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
