import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_ai_campaign_assistant_and_developer_keys(client: AsyncClient):
    """
    Test enterprise features:
    1. AI Campaign Assistant endpoint returns intelligent recommendations and policy risk evaluations.
    2. Developer API Key generation and listing.
    3. Participant Reputation query.
    """
    # 1. Register vendor
    v_resp = await client.post("/api/v1/auth/register/vendor", json={
        "email": "enterprise.dev@example.com",
        "password": "StrongPassword2026!",
        "full_name": "Enterprise Admin",
        "legal_name": "Enterprise Technologies Private Limited",
        "display_name": "Enterprise Tech",
        "industry": "Enterprise SaaS",
        "registered_address": "Bengaluru, Karnataka"
    })
    token = v_resp.json()["access_token"]

    # 2. Test AI Assistant
    ai_resp = await client.post(
        "/api/v1/ai/campaign-assistant",
        json={"category": "UGC", "target_goal": "Organic ceremonial matcha daily routine"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert ai_resp.status_code == 200
    ai_data = ai_resp.json()
    assert "suggested_title" in ai_data
    assert "COMPLIANT" in ai_data["policy_risk_assessment"]

    # 3. Test Developer API Key generation
    key_resp = await client.post(
        "/api/v1/developer/keys",
        json={"name": "Zapier CRM Connector"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert key_resp.status_code == 201
    key_data = key_resp.json()
    assert "inc_" in key_data["plain_secret_key"]

    # 4. Test Participant Reputation
    rep_resp = await client.get("/api/v1/reputation/me", headers={"Authorization": f"Bearer {token}"})
    assert rep_resp.status_code == 200
    assert "reliability_score" in rep_resp.json()
