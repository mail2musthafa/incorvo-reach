from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, Dict, Any, List
from fastapi import HTTPException, status
from app.models.ledger import (
    LedgerAccount,
    LedgerJournal,
    LedgerPosting,
    LedgerAccountType,
    JournalEntryType,
    PostingDirection,
    PayoutRequest
)

class LedgerService:
    @staticmethod
    async def get_or_create_account(
        db: AsyncSession,
        account_type: str,
        owner_type: str,
        owner_id: Optional[str] = None,
        description: Optional[str] = None
    ) -> LedgerAccount:
        """Fetch or initialize a ledger account for a vendor, participant, or platform."""
        query = select(LedgerAccount).where(
            LedgerAccount.account_type == account_type,
            LedgerAccount.owner_type == owner_type,
            LedgerAccount.owner_id == owner_id
        )
        result = await db.execute(query)
        account = result.scalars().first()

        if not account:
            account = LedgerAccount(
                account_type=account_type,
                owner_type=owner_type,
                owner_id=owner_id,
                description=description or f"{owner_type} {account_type}"
            )
            db.add(account)
            await db.flush()

        return account

    @staticmethod
    async def record_vendor_deposit(
        db: AsyncSession,
        vendor_id: str,
        amount: float,
        payment_ref: str
    ) -> LedgerJournal:
        """Record vendor campaign funds deposit."""
        if amount <= 0:
            raise HTTPException(status_code=400, detail="Deposit amount must be strictly positive")

        deposit_acc = await LedgerService.get_or_create_account(
            db, LedgerAccountType.VENDOR_DEPOSIT, "VENDOR", vendor_id, "Vendor Total Deposits Account"
        )
        avail_acc = await LedgerService.get_or_create_account(
            db, LedgerAccountType.VENDOR_AVAILABLE, "VENDOR", vendor_id, "Vendor Available Balance Account"
        )

        journal = LedgerJournal(
            entry_type=JournalEntryType.VENDOR_DEPOSIT,
            description=f"Deposit of ₹{amount:,.2f} via reference {payment_ref}",
            reference_id=vendor_id,
            reference_type="VENDOR_ORGANISATION"
        )
        db.add(journal)
        await db.flush()

        posting1 = LedgerPosting(
            journal_id=journal.id,
            account_id=avail_acc.id,
            amount=amount,
            direction=PostingDirection.DEBIT
        )
        posting2 = LedgerPosting(
            journal_id=journal.id,
            account_id=deposit_acc.id,
            amount=amount,
            direction=PostingDirection.CREDIT
        )
        db.add_all([posting1, posting2])
        await db.flush()
        return journal

    @staticmethod
    async def hold_campaign_budget(
        db: AsyncSession,
        vendor_id: str,
        campaign_id: str,
        total_budget: float
    ) -> LedgerJournal:
        """Allocate campaign budget from vendor's available balance into campaign reward reserve."""
        avail_acc = await LedgerService.get_or_create_account(
            db, LedgerAccountType.VENDOR_AVAILABLE, "VENDOR", vendor_id
        )
        reserve_acc = await LedgerService.get_or_create_account(
            db, LedgerAccountType.CAMPAIGN_REWARD_RESERVE, "PLATFORM", None, f"Allocated Reward Reserve for {campaign_id}"
        )

        journal = LedgerJournal(
            entry_type=JournalEntryType.CAMPAIGN_ALLOCATION,
            description=f"Campaign fund allocation of ₹{total_budget:,.2f} for campaign {campaign_id}",
            reference_id=campaign_id,
            reference_type="CAMPAIGN"
        )
        db.add(journal)
        await db.flush()

        posting1 = LedgerPosting(
            journal_id=journal.id,
            account_id=avail_acc.id,
            amount=total_budget,
            direction=PostingDirection.CREDIT
        )
        posting2 = LedgerPosting(
            journal_id=journal.id,
            account_id=reserve_acc.id,
            amount=total_budget,
            direction=PostingDirection.DEBIT
        )
        db.add_all([posting1, posting2])
        await db.flush()
        return journal

    @staticmethod
    async def release_campaign_allocation(
        db: AsyncSession,
        vendor_id: str,
        campaign_id: str,
        unspent_amount: float,
        reason: str = "Campaign cancelled / remaining funds released"
    ) -> LedgerJournal:
        """Release unspent allocated campaign budget back to vendor available balance."""
        if unspent_amount <= 0:
            return None

        avail_acc = await LedgerService.get_or_create_account(
            db, LedgerAccountType.VENDOR_AVAILABLE, "VENDOR", vendor_id
        )
        reserve_acc = await LedgerService.get_or_create_account(
            db, LedgerAccountType.CAMPAIGN_REWARD_RESERVE, "PLATFORM", None
        )

        journal = LedgerJournal(
            entry_type=JournalEntryType.CAMPAIGN_REFUND,
            description=f"Refund of ₹{unspent_amount:,.2f} for campaign {campaign_id} ({reason})",
            reference_id=campaign_id,
            reference_type="CAMPAIGN"
        )
        db.add(journal)
        await db.flush()

        # Reverse allocation: Credit reserve, Debit available balance
        posting1 = LedgerPosting(
            journal_id=journal.id,
            account_id=reserve_acc.id,
            amount=unspent_amount,
            direction=PostingDirection.CREDIT
        )
        posting2 = LedgerPosting(
            journal_id=journal.id,
            account_id=avail_acc.id,
            amount=unspent_amount,
            direction=PostingDirection.DEBIT
        )
        db.add_all([posting1, posting2])
        await db.flush()
        return journal

    @staticmethod
    async def settle_approved_mission(
        db: AsyncSession,
        submission_id: str,
        participant_id: str,
        reward_amount: float,
        platform_fee: float
    ) -> LedgerJournal:
        """Settle approved mission: distribute reserve into participant reward and platform revenue."""
        total_debit = reward_amount + platform_fee
        reserve_acc = await LedgerService.get_or_create_account(
            db, LedgerAccountType.CAMPAIGN_REWARD_RESERVE, "PLATFORM", None
        )
        participant_acc = await LedgerService.get_or_create_account(
            db, LedgerAccountType.PARTICIPANT_AVAILABLE, "PARTICIPANT", participant_id, "Participant Withdrawable Wallet"
        )
        platform_acc = await LedgerService.get_or_create_account(
            db, LedgerAccountType.PLATFORM_REVENUE, "PLATFORM", None, "Incorvo Platform Commission Revenue"
        )

        journal = LedgerJournal(
            entry_type=JournalEntryType.MISSION_SETTLEMENT,
            description=f"Mission settlement for submission {submission_id}: reward ₹{reward_amount:,.2f}, fee ₹{platform_fee:,.2f}",
            reference_id=submission_id,
            reference_type="SUBMISSION"
        )
        db.add(journal)
        await db.flush()

        p_reserve = LedgerPosting(
            journal_id=journal.id,
            account_id=reserve_acc.id,
            amount=total_debit,
            direction=PostingDirection.CREDIT
        )
        p_participant = LedgerPosting(
            journal_id=journal.id,
            account_id=participant_acc.id,
            amount=reward_amount,
            direction=PostingDirection.DEBIT
        )
        p_platform = LedgerPosting(
            journal_id=journal.id,
            account_id=platform_acc.id,
            amount=platform_fee,
            direction=PostingDirection.DEBIT
        )
        db.add_all([p_reserve, p_participant, p_platform])
        await db.flush()
        return journal

    @staticmethod
    async def handle_payout_failure(
        db: AsyncSession,
        payout_id: str,
        user_id: str,
        amount: float,
        reason: str
    ) -> LedgerJournal:
        """Failure scenario: Payout provider rejected transfer. Restore funds to participant available balance."""
        clearing_acc = await LedgerService.get_or_create_account(
            db, LedgerAccountType.PAYOUT_CLEARING, "PLATFORM", None
        )
        participant_acc = await LedgerService.get_or_create_account(
            db, LedgerAccountType.PARTICIPANT_AVAILABLE, "PARTICIPANT", user_id
        )

        journal = LedgerJournal(
            entry_type=JournalEntryType.PAYOUT_FAILED,
            description=f"Payout failure reversal of ₹{amount:,.2f} for payout {payout_id}: {reason}",
            reference_id=payout_id,
            reference_type="PAYOUT_REQUEST"
        )
        db.add(journal)
        await db.flush()

        posting1 = LedgerPosting(
            journal_id=journal.id,
            account_id=clearing_acc.id,
            amount=amount,
            direction=PostingDirection.CREDIT
        )
        posting2 = LedgerPosting(
            journal_id=journal.id,
            account_id=participant_acc.id,
            amount=amount,
            direction=PostingDirection.DEBIT
        )
        db.add_all([posting1, posting2])
        await db.flush()
        return journal

    @staticmethod
    async def get_participant_balance(db: AsyncSession, user_id: str) -> Dict[str, float]:
        """Calculate participant available balance and all-time earnings from postings."""
        acc_avail = await LedgerService.get_or_create_account(
            db, LedgerAccountType.PARTICIPANT_AVAILABLE, "PARTICIPANT", user_id
        )
        debit_q = select(func.coalesce(func.sum(LedgerPosting.amount), 0.0)).where(
            LedgerPosting.account_id == acc_avail.id,
            LedgerPosting.direction == PostingDirection.DEBIT
        )
        credit_q = select(func.coalesce(func.sum(LedgerPosting.amount), 0.0)).where(
            LedgerPosting.account_id == acc_avail.id,
            LedgerPosting.direction == PostingDirection.CREDIT
        )
        debit_res = (await db.execute(debit_q)).scalar_one()
        credit_res = (await db.execute(credit_q)).scalar_one()

        current_balance = float(debit_res - credit_res)
        all_time_earnings = float(debit_res)

        return {
            "current_balance": max(0.0, current_balance),
            "all_time_earnings": all_time_earnings,
            "total_withdrawn": float(credit_res)
        }

    @staticmethod
    async def get_vendor_balance(db: AsyncSession, vendor_id: str) -> Dict[str, float]:
        """Calculate vendor available balance and total deposits."""
        avail_acc = await LedgerService.get_or_create_account(
            db, LedgerAccountType.VENDOR_AVAILABLE, "VENDOR", vendor_id
        )
        debit_q = select(func.coalesce(func.sum(LedgerPosting.amount), 0.0)).where(
            LedgerPosting.account_id == avail_acc.id,
            LedgerPosting.direction == PostingDirection.DEBIT
        )
        credit_q = select(func.coalesce(func.sum(LedgerPosting.amount), 0.0)).where(
            LedgerPosting.account_id == avail_acc.id,
            LedgerPosting.direction == PostingDirection.CREDIT
        )
        debit_res = (await db.execute(debit_q)).scalar_one()
        credit_res = (await db.execute(credit_q)).scalar_one()

        return {
            "available_balance": max(0.0, float(debit_res - credit_res)),
            "total_deposited": float(debit_res),
            "total_spent": float(credit_res)
        }

    @staticmethod
    async def reconcile_entire_ledger(db: AsyncSession) -> Dict[str, Any]:
        """Verify the immutable ledger equation across all journals."""
        debit_q = select(func.coalesce(func.sum(LedgerPosting.amount), 0.0)).where(
            LedgerPosting.direction == PostingDirection.DEBIT
        )
        credit_q = select(func.coalesce(func.sum(LedgerPosting.amount), 0.0)).where(
            LedgerPosting.direction == PostingDirection.CREDIT
        )
        total_debits = float((await db.execute(debit_q)).scalar_one())
        total_credits = float((await db.execute(credit_q)).scalar_one())
        
        is_balanced = abs(total_debits - total_credits) < 0.01

        return {
            "is_balanced": is_balanced,
            "total_debits": total_debits,
            "total_credits": total_credits,
            "variance": abs(total_debits - total_credits)
        }
