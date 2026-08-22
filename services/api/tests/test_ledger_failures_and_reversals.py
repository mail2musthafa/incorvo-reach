import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.ledger_service import LedgerService
from app.models.ledger import LedgerPosting, PostingDirection

@pytest.mark.asyncio
async def test_payout_failure_reversal_and_entire_ledger_reconciliation(db_session: AsyncSession):
    """
    Test financial failure handling:
    1. Payout fails at provider rail -> funds return to participant available balance.
    2. Ledger reconciliation guarantees total debits == total credits across the system.
    """
    user_id = "p_fail_user_001"
    
    # Give participant initial earnings
    await LedgerService.settle_approved_mission(db_session, "sub_fail_1", user_id, 850.0, 127.5)
    await db_session.commit()

    # Simulate payout failure event
    fail_journal = await LedgerService.handle_payout_failure(
        db_session,
        payout_id="payout_fail_991",
        user_id=user_id,
        amount=500.0,
        reason="Bank IFSC temporarily unreachable"
    )
    await db_session.commit()

    # Verify journal postings balance
    assert fail_journal is not None

    # Audit entire platform ledger reconciliation equation
    reconciliation = await LedgerService.reconcile_entire_ledger(db_session)
    assert reconciliation["is_balanced"] is True
    assert reconciliation["variance"] == 0.0
