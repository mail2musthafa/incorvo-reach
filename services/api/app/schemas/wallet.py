from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class PayoutRequestCreate(BaseModel):
    amount: float = Field(ge=500.0, description="Minimum payout threshold ₹500")
    payout_account_id: Optional[str] = None
    account_type: str = "UPI" # UPI or BANK_ACCOUNT
    account_holder_name: str
    account_identifier: str # UPI ID or Bank Account No
    bank_ifsc: Optional[str] = None

class WalletSummaryResponse(BaseModel):
    current_balance: float
    all_time_earnings: float
    total_withdrawn: float
    pending_verification: float
    currency: str = "INR"

class VendorDepositRequest(BaseModel):
    amount: float = Field(gt=0)
    payment_method: str = "NETBANKING"

class VendorSummaryResponse(BaseModel):
    id: str
    legal_name: str
    display_name: str
    industry: str
    status: str
    available_balance: float
    total_deposited: float
    active_campaigns_count: int
    total_verified_actions: int
