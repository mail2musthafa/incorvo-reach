from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, JSON, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime, timezone
from app.core.database import Base

class CampaignType:
    VIDEO_QUIZ = "VIDEO_QUIZ"
    PRIVATE_SURVEY = "PRIVATE_SURVEY"
    PRODUCT_TEST = "PRODUCT_TEST"
    UGC = "UGC"
    QUALIFIED_LEAD = "QUALIFIED_LEAD"
    DEMO_BOOKING = "DEMO_BOOKING"
    STORE_VISIT = "STORE_VISIT"
    COUPON_REDEMPTION = "COUPON_REDEMPTION"
    REFERRAL = "REFERRAL"
    PURCHASE = "PURCHASE"
    BETA_TEST = "BETA_TEST"

class CampaignStatus:
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    CHANGES_REQUESTED = "CHANGES_REQUESTED"
    APPROVED = "APPROVED"
    SCHEDULED = "SCHEDULED"
    LIVE = "LIVE"
    PAUSED = "PAUSED"
    BUDGET_EXHAUSTED = "BUDGET_EXHAUSTED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"

class Campaign(Base):
    __tablename__ = "campaigns"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    tagline: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    template_type: Mapped[str] = mapped_column(String(50), default=CampaignType.PRIVATE_SURVEY, index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default=CampaignStatus.DRAFT, index=True, nullable=False)
    
    # Financials & Allocation (using compliant terminology: Allocated Campaign Funds / Reward Reserve)
    reward_per_action: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    platform_fee_per_action: Mapped[float] = mapped_column(Float, default=15.0, nullable=False)
    total_capacity: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    remaining_capacity: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    total_budget: Mapped[float] = mapped_column(Float, default=5750.0, nullable=False)
    budget_spent: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    # Timing & Lifecycles
    estimated_time_minutes: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    starts_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    paused_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Criteria & Rules
    requirements_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True)
    proof_instructions: Mapped[str] = mapped_column(Text, default="", nullable=False)
    verification_method: Mapped[str] = mapped_column(String(100), default="MANUAL_REVIEW", nullable=False)
    target_audience_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True)
    media_assets_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)
    moderation_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    vendor: Mapped["VendorOrganisation"] = relationship("VendorOrganisation", back_populates="campaigns")
    questions: Mapped[List["CampaignQuestion"]] = relationship("CampaignQuestion", back_populates="campaign", cascade="all, delete-orphan")
    assignments: Mapped[List["MissionAssignment"]] = relationship("MissionAssignment", back_populates="campaign")
    status_history: Mapped[List["CampaignStatusHistory"]] = relationship("CampaignStatusHistory", back_populates="campaign", cascade="all, delete-orphan")

class CampaignQuestion(Base):
    __tablename__ = "campaign_questions"

    campaign_id: Mapped[str] = mapped_column(String(36), ForeignKey("campaigns.id", ondelete="CASCADE"), index=True, nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    question_type: Mapped[str] = mapped_column(String(50), default="TEXT", nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    options_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)

    campaign: Mapped["Campaign"] = relationship("Campaign", back_populates="questions")

class CampaignStatusHistory(Base):
    __tablename__ = "campaign_status_history"

    campaign_id: Mapped[str] = mapped_column(String(36), ForeignKey("campaigns.id", ondelete="CASCADE"), index=True, nullable=False)
    previous_status: Mapped[str] = mapped_column(String(32), nullable=False)
    new_status: Mapped[str] = mapped_column(String(32), nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    changed_by_user_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)

    campaign: Mapped["Campaign"] = relationship("Campaign", back_populates="status_history")
