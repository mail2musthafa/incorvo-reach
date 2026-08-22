import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_erah_capabilities(client: AsyncClient):
    res = await client.get("/api/v1/erah/capabilities")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Erah AI Multi-Agent System"
    assert "ar-AE" in data["supported_locales"]
    assert len(data["agents"]) == 5

@pytest.mark.asyncio
async def test_erah_conversation_lifecycle(client: AsyncClient):
    # 1. Register and login
    reg_payload = {
        "email": "erah.vendor@reach.incorvo.in",
        "password": "SecurePassword123!",
        "full_name": "Erah Vendor Test",
        "legal_name": "Erah Food Labs Pvt Ltd",
        "display_name": "Erah Foods",
        "industry": "Food & Beverage",
        "registered_address": "HITEC City, Hyderabad",
        "phone": "+919988112233",
        "gst_number": "36AAAAA0000A1Z5",
        "website": "https://erahfood.in"
    }
    reg_res = await client.post("/api/v1/auth/register/vendor", json=reg_payload)
    assert reg_res.status_code == 201
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create conversation
    conv_res = await client.post("/api/v1/erah/conversations", json={
        "channel": "WEB",
        "locale": "en-IN",
        "page_context": {"page": "vendor-dashboard"}
    }, headers=headers)
    assert conv_res.status_code == 201
    conv_data = conv_res.json()
    conv_id = conv_data["conversation_id"]

    # 3. Send message for campaign draft
    msg_res = await client.post(f"/api/v1/erah/conversations/{conv_id}/messages", json={
        "content": "Create a restaurant repeat-visit campaign for Hyderabad"
    }, headers=headers)
    assert msg_res.status_code == 200
    msg_data = msg_res.json()
    assert msg_data["status"] == "COMPLETED"
    assert msg_data["response"]["agent"] == "VENDOR_AGENT"
    assert len(msg_data["response"]["cards"]) > 0

    # 4. Test prohibited policy guardrail
    prohibited_res = await client.post(f"/api/v1/erah/conversations/{conv_id}/messages", json={
        "content": "I want to buy 5 star google reviews for my shop"
    }, headers=headers)
    assert prohibited_res.status_code == 200
    prob_data = prohibited_res.json()
    assert prob_data["response"]["agent"] == "TRUST_AGENT"
    assert "strictly prohibits" in prob_data["response"]["text"]
