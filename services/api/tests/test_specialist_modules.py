import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_specialist_modules_api_endpoints(client: AsyncClient):
    """
    Test deep specialist modules:
    1. Research Studio: Studies & Sessions
    2. Sampling Operations: Inventory & Batches
    3. Content Studio: Creators & Contracts
    4. Field Operations: Stores & Corrective Actions
    5. Partner Attribution: Partners & Deep Links
    6. Sales Enablement: Courses & Scripts
    """
    # 1. Register vendor
    v_resp = await client.post("/api/v1/auth/register/vendor", json={
        "email": "specialist.dev@example.com",
        "password": "StrongPassword2026!",
        "full_name": "Specialist Director",
        "legal_name": "Specialist Operations Private Limited",
        "display_name": "Specialist Ops",
        "industry": "Consumer Goods & Field Retail",
        "registered_address": "Bengaluru, Karnataka"
    })
    token = v_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Research Studio
    r_resp = await client.get("/api/v1/research-studio/studies", headers=headers)
    assert r_resp.status_code == 200
    assert len(r_resp.json()) > 0

    # 2. Sampling
    s_resp = await client.get("/api/v1/sampling/inventory", headers=headers)
    assert s_resp.status_code == 200
    assert len(s_resp.json()) > 0

    # 3. Content Studio
    c_resp = await client.get("/api/v1/content-studio/creators", headers=headers)
    assert c_resp.status_code == 200
    assert len(c_resp.json()) > 0

    # 4. Field Operations
    f_resp = await client.get("/api/v1/field-operations/stores", headers=headers)
    assert f_resp.status_code == 200
    assert len(f_resp.json()) > 0

    # 5. Partner Attribution
    p_resp = await client.get("/api/v1/partner-attribution/partners", headers=headers)
    assert p_resp.status_code == 200
    assert len(p_resp.json()) > 0

    # 6. Sales Enablement
    se_resp = await client.get("/api/v1/sales-enablement/courses", headers=headers)
    assert se_resp.status_code == 200
    assert len(se_resp.json()) > 0
