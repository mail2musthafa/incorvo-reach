from sqlalchemy import String, Boolean, ForeignKey, Text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from app.core.database import Base

class VendorStatus:
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"
    SUSPENDED = "SUSPENDED"

class VendorRole:
    OWNER = "OWNER"
    CAMPAIGN_MANAGER = "CAMPAIGN_MANAGER"
    REVIEWER = "REVIEWER"
    ANALYST = "ANALYST"
    BILLING_MANAGER = "BILLING_MANAGER"

class VendorOrganisation(Base):
    __tablename__ = "vendor_organisations"

    legal_name: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str] = mapped_column(String(255), nullable=False)
    industry: Mapped[str] = mapped_column(String(100), nullable=False)
    business_type: Mapped[str] = mapped_column(String(100), default="PRIVATE_LIMITED", nullable=False)
    registration_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    gst_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    registered_address: Mapped[str] = mapped_column(Text, nullable=False)
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default=VendorStatus.DRAFT, index=True, nullable=False)
    estimated_monthly_budget: Mapped[float] = mapped_column(Float, default=50000.0, nullable=False)
    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)

    # Relationships
    memberships: Mapped[List["VendorMembership"]] = relationship("VendorMembership", back_populates="vendor", cascade="all, delete-orphan")
    documents: Mapped[List["VendorDocument"]] = relationship("VendorDocument", back_populates="vendor", cascade="all, delete-orphan")
    campaigns: Mapped[List["Campaign"]] = relationship("Campaign", back_populates="vendor")

class VendorMembership(Base):
    __tablename__ = "vendor_memberships"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    role: Mapped[str] = mapped_column(String(32), default=VendorRole.OWNER, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    vendor: Mapped["VendorOrganisation"] = relationship("VendorOrganisation", back_populates="memberships")
    user: Mapped["User"] = relationship("User", back_populates="vendor_memberships")

class VendorDocument(Base):
    __tablename__ = "vendor_documents"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    document_type: Mapped[str] = mapped_column(String(100), nullable=False)
    document_url: Mapped[str] = mapped_column(String(500), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    verification_status: Mapped[str] = mapped_column(String(32), default="PENDING", nullable=False)

    vendor: Mapped["VendorOrganisation"] = relationship("VendorOrganisation", back_populates="documents")
