import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.services.ledger_service import LedgerService
from app.models.ledger import LedgerJournal, LedgerPosting, PostingDirection

@pytest.mark.asyncio
async def test_double_entry_ledger_deposit_and_hold_balance_invariants(db_session: AsyncSession):
    """
    Crucial Financial Test:
    Every journal entry must strictly satisfy sum(DEBIT) == sum(CREDIT).
    Money cannot be created or lost without exact balancing double-entry postings.
    """
    vendor_id = "v_test_001"
    participant_id = "p_test_001"

    # 1. Vendor deposits ₹50,000
    journal1 = await LedgerService.record_vendor_deposit(db_session, vendor_id, 50000.0, "DEP_TEST_101")
    await db_session.commit()

    # Verify journal 1 postings balance
    p_q1 = select(LedgerPosting).where(LedgerPosting.journal_id == journal1.id)
    postings1 = (await db_session.execute(p_q1)).scalars().all()
    debit_sum1 = sum(p.amount for p in postings1 if p.direction == PostingDirection.DEBIT)
    credit_sum1 = sum(p.amount for p in postings1 if p.direction == PostingDirection.CREDIT)
    assert debit_sum1 == credit_sum1 == 50000.0

    # Check vendor balance
    v_bal = await LedgerService.get_vendor_balance(db_session, vendor_id)
    assert v_bal["available_balance"] == 50000.0

    # 2. Campaign budget hold of ₹11,500
    journal2 = await LedgerService.hold_campaign_budget(db_session, vendor_id, "camp_001", 11500.0)
    await db_session.commit()

    # Verify journal 2 balance
    p_q2 = select(LedgerPosting).where(LedgerPosting.journal_id == journal2.id)
    postings2 = (await db_session.execute(p_q2)).scalars().all()
    debit_sum2 = sum(p.amount for p in postings2 if p.direction == PostingDirection.DEBIT)
    credit_sum2 = sum(p.amount for p in postings2 if p.direction == PostingDirection.CREDIT)
    assert debit_sum2 == credit_sum2 == 11500.0

    # Check vendor available balance reduced
    v_bal_after = await LedgerService.get_vendor_balance(db_session, vendor_id)
    assert v_bal_after["available_balance"] == 38500.0

    # 3. Mission settlement (₹200 reward, ₹30 platform fee)
    journal3 = await LedgerService.settle_approved_mission(db_session, "sub_001", participant_id, 200.0, 30.0)
    await db_session.commit()

    # Verify journal 3 balance
    p_q3 = select(LedgerPosting).where(LedgerPosting.journal_id == journal3.id)
    postings3 = (await db_session.execute(p_q3)).scalars().all()
    debit_sum3 = sum(p.amount for p in postings3 if p.direction == PostingDirection.DEBIT)
    credit_sum3 = sum(p.amount for p in postings3 if p.direction == PostingDirection.CREDIT)
    assert debit_sum3 == credit_sum3 == 230.0

    # Check participant balance
    p_bal = await LedgerService.get_participant_balance(db_session, participant_id)
    assert p_bal["current_balance"] == 200.0
    assert p_bal["all_time_earnings"] == 200.0
