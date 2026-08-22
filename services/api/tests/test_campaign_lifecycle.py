import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_full_campaign_lifecycle_pause_resume_cancel_and_refund(client: AsyncClient):
    """
    Test complete campaign lifecycle:
    Creation -> Pause -> Resume -> Cancellation with remaining budget refund back to vendor available ledger balance.
    """
    # 1. Register vendor
    vendor_payload = {
        "email": "lifecycle.vendor@example.com",
        "password": "StrongPassword2026!",
        "full_name": "Lifecycle Vendor",
        "legal_name": "Lifecycle Organics Private Limited",
        "display_name": "Lifecycle Organics",
        "industry": "Consumer Health",
        "registered_address": "Bengaluru, Karnataka",
        "estimated_monthly_budget": 100000.0
    }
    v_resp = await client.post("/api/v1/auth/register/vendor", json=vendor_payload)
    assert v_resp.status_code == 201
    v_token = v_resp.json()["access_token"]

    # 2. Create campaign (50 capacity @ ₹100 + ₹15 fee = ₹5,750 total budget)
    camp_payload = {
        "title": "Clean Label Protein Bar Testing",
        "tagline": "Taste test our berry protein bar.",
        "description": "Qualitative evaluation of crunch and taste.",
        "template_type": "PRIVATE_SURVEY",
        "reward_per_action": 100.0,
        "total_capacity": 50,
        "estimated_time_minutes": 8,
        "proof_instructions": "Answer questions honestly.",
        "verification_method": "MANUAL_REVIEW"
    }
    c_resp = await client.post("/api/v1/campaigns", json=camp_payload, headers={"Authorization": f"Bearer {v_token}"})
    assert c_resp.status_code == 201
    c_data = c_resp.json()
    campaign_id = c_data["id"]
    assert c_data["status"] == "LIVE"

    # 3. Pause campaign
    pause_resp = await client.post(f"/api/v1/campaigns/{campaign_id}/pause", headers={"Authorization": f"Bearer {v_token}"})
    assert pause_resp.status_code == 200
    assert pause_resp.json()["status"] == "PAUSED"

    # 4. Resume campaign
    resume_resp = await client.post(f"/api/v1/campaigns/{campaign_id}/resume", headers={"Authorization": f"Bearer {v_token}"})
    assert resume_resp.status_code == 200
    assert resume_resp.json()["status"] == "LIVE"

    # 5. Extend campaign (add 20 spots)
    extend_resp = await client.post(
        f"/api/v1/campaigns/{campaign_id}/extend?additional_capacity=20",
        headers={"Authorization": f"Bearer {v_token}"}
    )
    assert extend_resp.status_code == 200
    assert extend_resp.json()["new_total_capacity"] == 70

    # 6. Cancel campaign (authorizes refund of unspent budget into vendor available balance)
    cancel_resp = await client.post(f"/api/v1/campaigns/{campaign_id}/cancel", headers={"Authorization": f"Bearer {v_token}"})
    assert cancel_resp.status_code == 200
    assert cancel_resp.json()["status"] == "CANCELLED"
    assert cancel_resp.json()["refunded_amount"] > 0
