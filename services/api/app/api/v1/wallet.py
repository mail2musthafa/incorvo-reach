from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.security import decode_token, security_scheme
from app.models.ledger import PayoutRequest, LedgerPosting, LedgerJournal, LedgerAccount, PostingDirection
from app.models.user import PayoutAccount
from app.schemas.wallet import PayoutRequestCreate, WalletSummaryResponse
from app.services.ledger_service import LedgerService
from datetime import datetime, timezone

router = APIRouter(prefix="/wallet", tags=["Wallet & Ledger"])

@router.get("/summary", response_model=WalletSummaryResponse)
async def get_wallet_summary(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    balances = await LedgerService.get_participant_balance(db, user_id)
    return WalletSummaryResponse(
        current_balance=balances["current_balance"],
        all_time_earnings=balances["all_time_earnings"],
        total_withdrawn=balances["total_withdrawn"],
        pending_verification=0.0,
        currency="INR"
    )

@router.get("/transactions", response_model=List[Dict[str, Any]])
async def get_transaction_history(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    # Fetch ledger postings associated with this user's accounts
    acc_q = select(LedgerAccount).where(LedgerAccount.owner_id == user_id)
    accounts = (await db.execute(acc_q)).scalars().all()
    if not accounts:
        return []

    acc_ids = [a.id for a in accounts]
    p_q = select(LedgerPosting, LedgerJournal).join(
        LedgerJournal, LedgerPosting.journal_id == LedgerJournal.id
    ).where(LedgerPosting.account_id.in_(acc_ids)).order_by(LedgerJournal.posted_at.desc())

    postings = (await db.execute(p_q)).all()
    results = []
    for posting, journal in postings:
        results.append({
            "id": posting.id,
            "journal_id": journal.id,
            "entry_type": journal.entry_type,
            "description": journal.description,
            "amount": posting.amount,
            "direction": posting.direction,
            "posted_at": journal.posted_at.isoformat()
        })
    return results

@router.post("/payout", response_model=dict)
async def request_payout(
    data: PayoutRequestCreate,
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    if data.amount < 500.0:
        raise HTTPException(status_code=400, detail="Minimum payout threshold is ₹500.00")

    balance_info = await LedgerService.get_participant_balance(db, user_id)
    if balance_info["current_balance"] < data.amount:
        raise HTTPException(status_code=400, detail=f"Insufficient balance. Available: ₹{balance_info['current_balance']:,.2f}")

    # Register or get payout account
    p_acc = PayoutAccount(
        user_id=user_id,
        account_type=data.account_type,
        account_holder_name=data.account_holder_name,
        account_identifier=data.account_identifier,
        bank_ifsc=data.bank_ifsc,
        is_verified=True,
        is_primary=True
    )
    db.add(p_acc)
    await db.flush()

    payout_req = PayoutRequest(
        user_id=user_id,
        payout_account_id=p_acc.id,
        amount=data.amount,
        currency="INR",
        status="QUEUED"
    )
    db.add(payout_req)
    await db.commit()

    return {
        "message": f"Payout request of ₹{data.amount:,.2f} queued successfully for {data.account_identifier}",
        "payout_id": payout_req.id,
        "status": payout_req.status
    }
