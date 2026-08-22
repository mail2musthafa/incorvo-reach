from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, JSON, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime, timezone
from app.core.database import Base

class TrainingCourse(Base):
    __tablename__ = "training_courses"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    passing_score_percent: Mapped[int] = mapped_column(Integer, default=80, nullable=False)
    estimated_duration_minutes: Mapped[int] = mapped_column(Integer, default=15, nullable=False)
    modules_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=False)

    certifications: Mapped[List["ParticipantCertification"]] = relationship("ParticipantCertification", back_populates="course", cascade="all, delete-orphan")

class ParticipantCertification(Base):
    __tablename__ = "participant_certifications"

    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("training_courses.id", ondelete="CASCADE"), index=True, nullable=False)
    participant_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    score_achieved: Mapped[float] = mapped_column(Float, nullable=False)
    is_passed: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    certificate_code: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    course: Mapped["TrainingCourse"] = relationship("TrainingCourse", back_populates="certifications")

class SalesScript(Base):
    __tablename__ = "sales_scripts"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id", ondelete="CASCADE"), index=True, nullable=False)
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    target_customer_profile: Mapped[str] = mapped_column(String(255), nullable=False)
    opening_hook: Mapped[str] = mapped_column(Text, nullable=False)
    key_value_props_json: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=False)
    objection_handling_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=False)
    closing_cta: Mapped[str] = mapped_column(Text, nullable=False)
