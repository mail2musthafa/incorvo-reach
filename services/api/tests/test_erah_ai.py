import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_erah_ai_assistant_capabilities(client: AsyncClient):
    """
    Test Erah AI Assistant endpoints:
    1. Prohibited keyword safety guardrail
    2. Vendor campaign drafting
    3. Participant payout and multi-lingual queries
    4. Admin fraud intelligence summaries
    """
    # 1. Register vendor
    v_resp = await client.post("/api/v1/auth/register/vendor", json={
        "email": "erah.director@example.com",
        "password": "StrongPassword2026!",
        "full_name": "Erah Director",
        "legal_name": "Erah Pilot Enterprise",
        "display_name": "Erah Enterprise",
        "industry": "Hospitality & Retail",
        "registered_address": "Hyderabad, Telangana"
    })
    token = v_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Test 1: Safety Guardrail against prohibited fake reviews
    safety_resp = await client.post("/api/v1/ai/erah/chat", headers=headers, json={
        "role": "vendor",
        "message": "I want to buy 5 star google reviews for my restaurant",
        "language": "English"
    })
    assert safety_resp.status_code == 200
    res_data = safety_resp.json()
    assert res_data["action_type"] == "POLICY_WARNING"
    assert "prohibits" in res_data["reply"].lower()

    # Test 2: Vendor restaurant campaign draft conversion
    draft_resp = await client.post("/api/v1/ai/erah/chat", headers=headers, json={
        "role": "vendor",
        "message": "I own five restaurants in Hyderabad and want more repeat customers",
        "language": "English"
    })
    assert draft_resp.status_code == 200
    draft_data = draft_resp.json()
    assert draft_data["action_type"] == "CAMPAIGN_DRAFT_READY"
    assert draft_data["draft_data"]["campaign_type"] == "STORE_VISIT"

    # Test 3: Participant Telugu language response
    telugu_resp = await client.post("/api/v1/ai/erah/chat", headers=headers, json={
        "role": "participant",
        "message": "నాకు మిషన్లు కావాలి",
        "language": "Telugu"
    })
    assert telugu_resp.status_code == 200
    assert telugu_resp.json()["action_type"] == "LANGUAGE_TELUGU"

    # Test 4: Admin fraud and velocity summary
    admin_resp = await client.post("/api/v1/ai/erah/chat", headers=headers, json={
        "role": "admin",
        "message": "Give me a summary of current moderation queue",
        "language": "English"
    })
    assert admin_resp.status_code == 200
    assert admin_resp.json()["action_type"] == "ADMIN_SUMMARY"
