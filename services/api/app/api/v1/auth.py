import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    UserRole,
    security_scheme,
)
from app.models.user import User, UserProfile, UserSession, UserConsent
from app.models.vendor import VendorOrganisation, VendorMembership, VendorRole, VendorStatus
from app.schemas.auth import (
    RegisterParticipantRequest,
    RegisterVendorRequest,
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    UserProfileResponse,
    PhoneOtpRequest,
    PhoneOtpVerify,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register/participant", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_participant(data: RegisterParticipantRequest, db: AsyncSession = Depends(get_db)):
    # Check existing email
    query = select(User).where(User.email == data.email.lower())
    existing = (await db.execute(query)).scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    new_user = User(
        email=data.email.lower(),
        phone=data.phone,
        hashed_password=hash_password(data.password),
        role=UserRole.PARTICIPANT,
        is_active=True,
        is_verified=True,
        phone_verified=bool(data.phone),
    )
    db.add(new_user)
    await db.flush()

    new_profile = UserProfile(
        user_id=new_user.id,
        full_name=data.full_name,
        city=data.city,
        state=data.state,
        pin_code=data.pin_code,
        age_range=data.age_range,
        occupation=data.occupation,
        interests=data.interests or [],
        preferred_language=data.preferred_language or "English",
    )
    consent = UserConsent(
        user_id=new_user.id,
        consent_type="TERMS_AND_PRIVACY_V1",
        version="1.0"
    )
    db.add_all([new_profile, consent])

    access_token = create_access_token(new_user.id, new_user.role, {"email": new_user.email, "name": data.full_name})
    refresh_token = create_refresh_token(new_user.id)

    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    session = UserSession(user_id=new_user.id, refresh_token_hash=token_hash)
    db.add(session)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=new_user.id,
        role=new_user.role,
        email=new_user.email,
        full_name=data.full_name,
    )

@router.post("/register/vendor", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_vendor(data: RegisterVendorRequest, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == data.email.lower())
    existing = (await db.execute(query)).scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    new_user = User(
        email=data.email.lower(),
        phone=data.phone,
        hashed_password=hash_password(data.password),
        role=UserRole.VENDOR_OWNER,
        is_active=True,
        is_verified=True,
    )
    db.add(new_user)
    await db.flush()

    new_profile = UserProfile(
        user_id=new_user.id,
        full_name=data.full_name,
        preferred_language="English",
    )
    
    vendor = VendorOrganisation(
        legal_name=data.legal_name,
        display_name=data.display_name,
        industry=data.industry,
        business_type=data.business_type,
        registration_number=data.registration_number,
        gst_number=data.gst_number,
        registered_address=data.registered_address,
        website=data.website,
        status=VendorStatus.VERIFIED, # Pre-verified for smooth onboarding in demo
        estimated_monthly_budget=data.estimated_monthly_budget,
        owner_id=new_user.id,
    )
    db.add_all([new_profile, vendor])
    await db.flush()

    membership = VendorMembership(
        vendor_id=vendor.id,
        user_id=new_user.id,
        role=VendorRole.OWNER,
        is_active=True
    )
    db.add(membership)

    access_token = create_access_token(
        new_user.id,
        new_user.role,
        {"email": new_user.email, "name": data.full_name, "vendor_id": vendor.id}
    )
    refresh_token = create_refresh_token(new_user.id)
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    session = UserSession(user_id=new_user.id, refresh_token_hash=token_hash)
    db.add(session)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=new_user.id,
        role=new_user.role,
        email=new_user.email,
        full_name=data.full_name,
        vendor_id=vendor.id
    )

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == data.email.lower())
    user = (await db.execute(query)).scalars().first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account has been suspended")

    profile_q = select(UserProfile).where(UserProfile.user_id == user.id)
    profile = (await db.execute(profile_q)).scalars().first()
    full_name = profile.full_name if profile else user.email

    vendor_id = None
    if user.role in [UserRole.VENDOR_OWNER, UserRole.VENDOR_MANAGER, UserRole.VENDOR_ANALYST]:
        v_q = select(VendorMembership).where(VendorMembership.user_id == user.id, VendorMembership.is_active == True)
        membership = (await db.execute(v_q)).scalars().first()
        if membership:
            vendor_id = membership.vendor_id

    access_token = create_access_token(
        user.id,
        user.role,
        {"email": user.email, "name": full_name, "vendor_id": vendor_id}
    )
    refresh_token = create_refresh_token(user.id)
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    session = UserSession(user_id=user.id, refresh_token_hash=token_hash)
    db.add(session)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id,
        role=user.role,
        email=user.email,
        full_name=full_name,
        vendor_id=vendor_id
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(data: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    payload = decode_token(data.refresh_token)
    user_id = payload.get("sub")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=400, detail="Invalid token type for refresh")

    user_q = select(User).where(User.id == user_id)
    user = (await db.execute(user_q)).scalars().first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User session invalid")

    profile_q = select(UserProfile).where(UserProfile.user_id == user.id)
    profile = (await db.execute(profile_q)).scalars().first()
    full_name = profile.full_name if profile else user.email

    vendor_id = None
    v_q = select(VendorMembership).where(VendorMembership.user_id == user.id, VendorMembership.is_active == True)
    membership = (await db.execute(v_q)).scalars().first()
    if membership:
        vendor_id = membership.vendor_id

    new_access_token = create_access_token(
        user.id,
        user.role,
        {"email": user.email, "name": full_name, "vendor_id": vendor_id}
    )
    new_refresh_token = create_refresh_token(user.id)

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        user_id=user.id,
        role=user.role,
        email=user.email,
        full_name=full_name,
        vendor_id=vendor_id
    )

@router.post("/otp/request")
async def request_phone_otp(data: PhoneOtpRequest):
    # Mock OTP provider in development
    return {"message": "OTP sent successfully (Development code: 492015)", "phone": data.phone}

@router.post("/otp/verify")
async def verify_phone_otp(data: PhoneOtpVerify):
    if data.otp in ["492015", "123456"]:
        return {"verified": True, "phone": data.phone}
    raise HTTPException(status_code=400, detail="Invalid OTP code entered")

@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(
    auth=Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not auth or not auth.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")

    user_q = select(User).where(User.id == user_id)
    user = (await db.execute(user_q)).scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile_q = select(UserProfile).where(UserProfile.user_id == user.id)
    profile = (await db.execute(profile_q)).scalars().first()

    vendor_id = None
    vendor_name = None
    v_q = select(VendorMembership, VendorOrganisation).join(
        VendorOrganisation, VendorMembership.vendor_id == VendorOrganisation.id
    ).where(VendorMembership.user_id == user.id, VendorMembership.is_active == True)
    v_res = (await db.execute(v_q)).first()
    if v_res:
        vendor_id = v_res[1].id
        vendor_name = v_res[1].display_name

    return UserProfileResponse(
        id=user.id,
        email=user.email,
        phone=user.phone,
        role=user.role,
        is_active=user.is_active,
        is_verified=user.is_verified,
        full_name=profile.full_name if profile else user.email,
        city=profile.city if profile else None,
        state=profile.state if profile else None,
        pin_code=profile.pin_code if profile else None,
        age_range=profile.age_range if profile else None,
        occupation=profile.occupation if profile else None,
        interests=profile.interests if profile else [],
        preferred_language=profile.preferred_language if profile else "English",
        vendor_id=vendor_id,
        vendor_name=vendor_name
    )
