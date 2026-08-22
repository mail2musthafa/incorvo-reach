import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["parent_company"] == "Quenix Analytics Private Limited"

@pytest.mark.asyncio
async def test_participant_registration_and_login(client: AsyncClient):
    # Register participant
    reg_payload = {
        "email": "test.participant@reach.incorvo.in",
        "password": "SecurePassword123!",
        "full_name": "Test Participant",
        "phone": "+919988776655",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pin_code": "560001",
        "age_range": "25-34",
        "occupation": "Product Analyst",
        "interests": ["Tech", "Design"]
    }
    reg_resp = await client.post("/api/v1/auth/register/participant", json=reg_payload)
    assert reg_resp.status_code == 201
    reg_data = reg_resp.json()
    assert "access_token" in reg_data
    assert reg_data["role"] == "PARTICIPANT"

    # Login
    login_resp = await client.post("/api/v1/auth/login", json={
        "email": "test.participant@reach.incorvo.in",
        "password": "SecurePassword123!"
    })
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "access_token" in login_data
    assert login_data["email"] == "test.participant@reach.incorvo.in"

    # Access /me
    token = login_data["access_token"]
    me_resp = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["full_name"] == "Test Participant"
    assert me_data["city"] == "Bengaluru"
