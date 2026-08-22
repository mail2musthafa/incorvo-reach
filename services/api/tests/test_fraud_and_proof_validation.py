import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_signed_upload_urls_and_mime_validation(client: AsyncClient):
    """Test proof security, signed upload URLs and MIME validation."""
    # Register participant
    p_resp = await client.post("/api/v1/auth/register/participant", json={
        "email": "proof.tester@example.com",
        "password": "StrongPassword2026!",
        "full_name": "Proof Tester"
    })
    token = p_resp.json()["access_token"]

    # 1. Valid image MIME
    valid_resp = await client.post(
        "/api/v1/proofs/signed-upload-url",
        json={"file_name": "survey_screen.png", "file_size_bytes": 1048576, "mime_type": "image/png"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert valid_resp.status_code == 200
    assert "upload_url" in valid_resp.json()

    # 2. Disallowed executable MIME format
    bad_resp = await client.post(
        "/api/v1/proofs/signed-upload-url",
        json={"file_name": "malicious.exe", "file_size_bytes": 1048576, "mime_type": "application/x-msdownload"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert bad_resp.status_code == 400
