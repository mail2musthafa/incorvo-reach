import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Dict, List
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

ph = PasswordHasher(
    time_cost=3,
    memory_cost=65536,
    parallelism=4,
    hash_len=32,
    salt_len=16
)

security_scheme = HTTPBearer(auto_error=False)

class UserRole:
    PUBLIC = "PUBLIC"
    PARTICIPANT = "PARTICIPANT"
    VENDOR_OWNER = "VENDOR_OWNER"
    VENDOR_MANAGER = "VENDOR_MANAGER"
    VENDOR_ANALYST = "VENDOR_ANALYST"
    VERIFIER_MODERATOR = "VERIFIER_MODERATOR"
    FINANCE_ADMIN = "FINANCE_ADMIN"
    SUPPORT_ADMIN = "SUPPORT_ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"

ALL_ROLES = [
    UserRole.PUBLIC,
    UserRole.PARTICIPANT,
    UserRole.VENDOR_OWNER,
    UserRole.VENDOR_MANAGER,
    UserRole.VENDOR_ANALYST,
    UserRole.VERIFIER_MODERATOR,
    UserRole.FINANCE_ADMIN,
    UserRole.SUPPORT_ADMIN,
    UserRole.SUPER_ADMIN,
]

ADMIN_ROLES = [
    UserRole.VERIFIER_MODERATOR,
    UserRole.FINANCE_ADMIN,
    UserRole.SUPPORT_ADMIN,
    UserRole.SUPER_ADMIN,
]

VENDOR_ROLES = [
    UserRole.VENDOR_OWNER,
    UserRole.VENDOR_MANAGER,
    UserRole.VENDOR_ANALYST,
]

def hash_password(password: str) -> str:
    """Hash password using Argon2id."""
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against Argon2id hash."""
    try:
        return ph.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False
    except Exception:
        return False

def create_access_token(subject: str, role: str, extra_claims: Optional[Dict[str, Any]] = None) -> str:
    """Generate short-lived JWT access token."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": subject,
        "role": role,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access"
    }
    if extra_claims:
        to_encode.update(extra_claims)
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(subject: str) -> str:
    """Generate long-lived JWT refresh token."""
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh"
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> Dict[str, Any]:
    """Decode and validate JWT token signature and expiration."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_roles(allowed_roles: List[str]):
    """Decorator dependency for RBAC validation."""
    def role_checker(auth: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)):
        if not auth or not auth.credentials:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
                headers={"WWW-Authenticate": "Bearer"},
            )
        payload = decode_token(auth.credentials)
        user_role = payload.get("role")
        if user_role not in allowed_roles and user_role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}",
            )
        return payload
    return role_checker
