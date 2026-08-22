from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, JSON, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime, timezone
from app.core.database import Base

class LeadStatus:
    NEW = "NEW"
    CONTACTED = "CONTACTED"
    APPOINTMENT_SCHEDULED = "APPOINTMENT_SCHEDULED"
    QUALIFIED = "QUALIFIED"
    CONVERTED = "CONVERTED"
    LOST = "LOST"

class LeadRecord(Base):
    __tablename__ = "lead_records"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    campaign_id: Mapped[str] = mapped_column(String(36), ForeignKey("campaigns.id", ondelete="CASCADE"), index=True, nullable=False)
    participant_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    
    lead_name: Mapped[str] = mapped_column(String(255), nullable=False)
    lead_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    lead_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    status: Mapped[str] = mapped_column(String(32), default=LeadStatus.NEW, index=True, nullable=False)
    consent_granted: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    consent_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    
    estimated_value_inr: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    actual_conversion_value_inr: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    follow_up_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    vendor_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True)

class CRMSyncConfig(Base):
    __tablename__ = "crm_sync_configs"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), unique=True, nullable=False)
    provider: Mapped[str] = mapped_column(String(50), default="WEBHOOK", nullable=False) # ZOHO, SALESFORCE, HUBSPOT, INCORVO_ONE, WEBHOOK
    webhook_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    api_key_encrypted: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    auto_sync_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    last_synced_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
