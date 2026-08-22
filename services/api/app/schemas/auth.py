from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class RegisterParticipantRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, description="Password min 8 chars")
    full_name: str
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pin_code: Optional[str] = None
    age_range: Optional[str] = "25-34"
    occupation: Optional[str] = None
    interests: Optional[List[str]] = []
    preferred_language: Optional[str] = "English"

class RegisterVendorRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str
    phone: Optional[str] = None
    legal_name: str
    display_name: str
    industry: str
    business_type: str = "PRIVATE_LIMITED"
    registration_number: Optional[str] = None
    gst_number: Optional[str] = None
    registered_address: str
    website: Optional[str] = None
    estimated_monthly_budget: float = 50000.0

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    email: str
    full_name: str
    vendor_id: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class PhoneOtpRequest(BaseModel):
    phone: str

class PhoneOtpVerify(BaseModel):
    phone: str
    otp: str

class UserProfileResponse(BaseModel):
    id: str
    email: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    is_verified: bool
    full_name: str
    city: Optional[str] = None
    state: Optional[str] = None
    pin_code: Optional[str] = None
    age_range: Optional[str] = None
    occupation: Optional[str] = None
    interests: Optional[List[str]] = []
    preferred_language: str
    vendor_id: Optional[str] = None
    vendor_name: Optional[str] = None
