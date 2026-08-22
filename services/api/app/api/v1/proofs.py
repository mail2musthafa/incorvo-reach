import hashlib
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
from app.core.security import decode_token, security_scheme

router = APIRouter(prefix="/proofs", tags=["Proof Storage & Security"])

class SignedUrlRequest(BaseModel):
    file_name: str
    file_size_bytes: int = Field(gt=0, le=50 * 1024 * 1024) # 50MB max limit
    mime_type: str = "image/jpeg"

class SignedUrlResponse(BaseModel):
    upload_url: str
    public_cdn_url: str
    file_key: str
    expires_in_seconds: int

@router.post("/signed-upload-url", response_model=SignedUrlResponse)
async def generate_signed_upload_url(
    data: SignedUrlRequest,
    auth=Depends(security_scheme)
):
    """Generate pre-signed upload URL for secure, direct-to-S3 asset storage with size and MIME validation."""
    if not auth:
        raise HTTPException(status_code=401, detail="Authentication required")

    allowed_mimes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/quicktime",
        "application/pdf"
    ]
    if data.mime_type not in allowed_mimes:
        raise HTTPException(status_code=400, detail=f"Unsupported file format: {data.mime_type}. Supported: JPEG, PNG, WEBP, MP4, MOV, PDF.")

    file_id = str(uuid.uuid4())
    file_key = f"proofs/{file_id}_{data.file_name}"
    
    # In development/mock mode, provide safe direct URI
    mock_upload_url = f"https://mock-storage.reach.incorvo.in/upload/{file_key}"
    public_url = f"https://mock-cdn.reach.incorvo.in/{file_key}"

    return SignedUrlResponse(
        upload_url=mock_upload_url,
        public_cdn_url=public_url,
        file_key=file_key,
        expires_in_seconds=900
    )
