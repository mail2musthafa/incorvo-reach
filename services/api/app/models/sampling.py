from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, JSON, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime, timezone
from app.core.database import Base

class SampleProduct(Base):
    __tablename__ = "sample_products"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    sku: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    weight_grams: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    unit_cost_inr: Mapped[float] = mapped_column(Float, default=50.0, nullable=False)
    stock_quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    allocated_quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

class SampleDispatchBatch(Base):
    __tablename__ = "sample_dispatch_batches"

    campaign_id: Mapped[str] = mapped_column(String(36), ForeignKey("campaigns.id", ondelete="CASCADE"), index=True, nullable=False)
    batch_reference: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    courier_partner: Mapped[str] = mapped_column(String(100), default="DELHIVERY", nullable=False) # BLUEDART, DELHIVERY, SHIPROCKET
    total_units: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="PROCESSING", nullable=False) # PROCESSING, DISPATCHED, IN_TRANSIT, DELIVERED, COMPLETED

    shipments: Mapped[List["SampleShipment"]] = relationship("SampleShipment", back_populates="batch", cascade="all, delete-orphan")

class SampleShipment(Base):
    __tablename__ = "sample_shipments"

    batch_id: Mapped[str] = mapped_column(String(36), ForeignKey("sample_dispatch_batches.id", ondelete="CASCADE"), index=True, nullable=False)
    participant_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("sample_products.id"), nullable=False)
    
    shipping_address: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    pin_code: Mapped[str] = mapped_column(String(20), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(32), nullable=False)
    
    tracking_number: Mapped[Optional[str]] = mapped_column(String(100), index=True, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="LABEL_CREATED", nullable=False) # LABEL_CREATED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, FAILED_ATTEMPT, RETURNED
    dispatched_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    delivered_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    replacement_requested: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    batch: Mapped["SampleDispatchBatch"] = relationship("SampleDispatchBatch", back_populates="shipments")
