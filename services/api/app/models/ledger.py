from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, Text, Index, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime, timezone
from app.core.database import Base

class LedgerAccountType:
    VENDOR_DEPOSIT = "VENDOR_DEPOSIT"             # Vendor's deposited funds balance
    VENDOR_AVAILABLE = "VENDOR_AVAILABLE"         # Unreserved balance available for campaigns
    CAMPAIGN_REWARD_RESERVE = "CAMPAIGN_REWARD_RESERVE" # Allocated campaign funds held for in-flight missions
    PARTICIPANT_PENDING = "PARTICIPANT_PENDING"   # Earned rewards under verification/hold
    PARTICIPANT_AVAILABLE = "PARTICIPANT_AVAILABLE" # Withdrawable earnings
    PLATFORM_REVENUE = "PLATFORM_REVENUE"         # Incorvo platform commissions
    PAYOUT_CLEARING = "PAYOUT_CLEARING"           # Outbound payout transit account

class JournalEntryType:
    VENDOR_DEPOSIT = "VENDOR_DEPOSIT"
    CAMPAIGN_ALLOCATION = "CAMPAIGN_ALLOCATION"
    MISSION_RESERVE_HOLD = "MISSION_RESERVE_HOLD"
    HOLD_RELEASE_REJECTED = "HOLD_RELEASE_REJECTED"
    HOLD_RELEASE_EXPIRED = "HOLD_RELEASE_EXPIRED"
    MISSION_SETTLEMENT = "MISSION_SETTLEMENT"
    PAYOUT_REQUEST = "PAYOUT_REQUEST"
    PAYOUT_COMPLETED = "PAYOUT_COMPLETED"
    PAYOUT_FAILED = "PAYOUT_FAILED"
    PAYOUT_REVERSED = "PAYOUT_REVERSED"
    DISPUTE_ADJUSTMENT = "DISPUTE_ADJUSTMENT"
    CAMPAIGN_REFUND = "CAMPAIGN_REFUND"

class PostingDirection:
    DEBIT = "DEBIT"
    CREDIT = "CREDIT"

class LedgerAccount(Base):
    __tablename__ = "ledger_accounts"

    account_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    owner_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False) # VENDOR, PARTICIPANT, PLATFORM
    owner_id: Mapped[Optional[str]] = mapped_column(String(36), index=True, nullable=True) # Vendor ID, User ID, or NULL for platform
    currency: Mapped[str] = mapped_column(String(10), default="INR", nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    postings: Mapped[List["LedgerPosting"]] = relationship("LedgerPosting", back_populates="account")

    __table_args__ = (
        Index("ix_ledger_account_owner", "owner_type", "owner_id", "account_type"),
    )

class LedgerJournal(Base):
    __tablename__ = "ledger_journals"

    entry_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    reference_id: Mapped[Optional[str]] = mapped_column(String(36), index=True, nullable=True)
    reference_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    posted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    postings: Mapped[List["LedgerPosting"]] = relationship("LedgerPosting", back_populates="journal", cascade="all, delete-orphan")

class LedgerPosting(Base):
    __tablename__ = "ledger_postings"

    journal_id: Mapped[str] = mapped_column(String(36), ForeignKey("ledger_journals.id", ondelete="CASCADE"), index=True, nullable=False)
    account_id: Mapped[str] = mapped_column(String(36), ForeignKey("ledger_accounts.id", ondelete="CASCADE"), index=True, nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    direction: Mapped[str] = mapped_column(String(10), nullable=False) # DEBIT, CREDIT

    journal: Mapped["LedgerJournal"] = relationship("LedgerJournal", back_populates="postings")
    account: Mapped["LedgerAccount"] = relationship("LedgerAccount", back_populates="postings")

class VendorDeposit(Base):
    __tablename__ = "vendor_deposits"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_organisations.id"), index=True, nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR", nullable=False)
    payment_method: Mapped[str] = mapped_column(String(50), default="NETBANKING", nullable=False)
    payment_reference: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="COMPLETED", nullable=False)

class PayoutRequest(Base):
    __tablename__ = "payout_requests"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    payout_account_id: Mapped[str] = mapped_column(String(36), ForeignKey("payout_accounts.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="QUEUED", index=True, nullable=False) # REQUESTED, KYC_REQUIRED, QUEUED, PROCESSING, PAID, FAILED, REVERSED, CANCELLED
    provider_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    failure_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    retry_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

class IdempotencyRecord(Base):
    __tablename__ = "idempotency_records"

    idempotency_key: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    endpoint: Mapped[str] = mapped_column(String(255), nullable=False)
    response_status: Mapped[int] = mapped_column(Integer, nullable=False)
    response_body: Mapped[str] = mapped_column(Text, nullable=False)
