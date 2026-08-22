from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, JSON, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime, timezone
from app.core.database import Base

class StoreMaster(Base):
    __tablename__ = "store_masters"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    store_code: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    store_name: Mapped[str] = mapped_column(String(255), nullable=False)
    retail_chain: Mapped[str] = mapped_column(String(100), default="INDEPENDENT", nullable=False) # RELIANCE_RETAIL, DMART, APOLLO, NATURES_BASKET
    address: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    pin_code: Mapped[str] = mapped_column(String(20), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    geofence_radius_meters: Mapped[int] = mapped_column(Integer, default=150, nullable=False)
    qr_token: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

class ProductSku(Base):
    __tablename__ = "product_skus"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    sku_code: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    sku_name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    target_mrp_inr: Mapped[float] = mapped_column(Float, nullable=False)
    barcode_ean: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    shelf_facing_target: Mapped[int] = mapped_column(Integer, default=2, nullable=False)

class CorrectiveAction(Base):
    __tablename__ = "corrective_actions"

    store_id: Mapped[str] = mapped_column(String(36), ForeignKey("store_masters.id", ondelete="CASCADE"), index=True, nullable=False)
    submission_id: Mapped[str] = mapped_column(String(36), ForeignKey("submissions.id"), nullable=False)
    issue_type: Mapped[str] = mapped_column(String(50), nullable=False) # OUT_OF_STOCK, INCORRECT_PRICE, DAMAGED_PACKAGING, SHELF_SHARE_LOW
    description: Mapped[str] = mapped_column(Text, nullable=False)
    assigned_supervisor_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="OPEN", nullable=False) # OPEN, IN_PROGRESS, RESOLVED, VERIFIED
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
