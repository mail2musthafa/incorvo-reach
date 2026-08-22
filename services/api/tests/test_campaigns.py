import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_vendor_campaign_creation_and_mission_flow(client: AsyncClient):
    # 1. Register vendor
    vendor_payload = {
        "email": "brand@zenithorganics.com",
        "password": "StrongPassword2026!",
        "full_name": "Zenith Founder",
        "legal_name": "Zenith Organics Private Limited",
        "display_name": "Zenith Organics",
        "industry": "Consumer Health",
        "registered_address": "Koramangala 4th Block, Bengaluru",
        "estimated_monthly_budget": 100000.0
    }
    v_resp = await client.post("/api/v1/auth/register/vendor", json=vendor_payload)
    assert v_resp.status_code == 201
    v_data = v_resp.json()
    v_token = v_data["access_token"]
    assert v_data["role"] == "VENDOR_OWNER"

    # 2. Create campaign
    camp_payload = {
        "title": "Clean Label Granola Tasting",
        "tagline": "Try our cold-baked berry granola and submit private feedback.",
        "description": "Evaluate crunchy cluster texture and natural berry tartness.",
        "template_type": "PRIVATE_SURVEY",
        "reward_per_action": 120.0,
        "total_capacity": 25,
        "estimated_time_minutes": 10,
        "proof_instructions": "Answer feedback questions genuinely.",
        "verification_method": "MANUAL_REVIEW",
        "questions": [
            {
                "question_text": "How would you rate the crunch longevity?",
                "question_type": "SINGLE_CHOICE",
                "options_json": ["Crisp and crunchy", "Slightly soft", "Too hard"]
            }
        ]
    }
    c_resp = await client.post(
        "/api/v1/campaigns",
        json=camp_payload,
        headers={"Authorization": f"Bearer {v_token}"}
    )
    assert c_resp.status_code == 201
    c_data = c_resp.json()
    campaign_id = c_data["id"]
    assert c_data["status"] == "LIVE"
    assert c_data["remaining_capacity"] == 25

    # 3. Register participant
    p_resp = await client.post("/api/v1/auth/register/participant", json={
        "email": "granola.tester@example.com",
        "password": "StrongPassword2026!",
        "full_name": "Granola Tester",
        "city": "Bengaluru",
        "state": "Karnataka"
    })
    p_token = p_resp.json()["access_token"]

    # 4. Participant accepts mission
    accept_resp = await client.post(
        f"/api/v1/missions/{campaign_id}/accept",
        headers={"Authorization": f"Bearer {p_token}"}
    )
    assert accept_resp.status_code == 200
    assignment_id = accept_resp.json()["assignment_id"]

    # 5. Participant submits proof
    q_id = c_data["questions"][0]["id"]
    sub_resp = await client.post(
        f"/api/v1/missions/assignments/{assignment_id}/submit",
        json={
            "answers": [
                {"question_id": q_id, "answer_text": "Crisp and crunchy"}
            ],
            "proof_artifacts": [
                {
                    "artifact_type": "IMAGE",
                    "file_url": "https://example.com/granola_bowl.jpg",
                    "file_name": "granola_bowl.jpg",
                    "file_size_bytes": 102400
                }
            ]
        },
        headers={"Authorization": f"Bearer {p_token}"}
    )
    assert sub_resp.status_code == 200
    sub_id = sub_resp.json()["submission_id"]

    # 6. Vendor approves submission
    review_resp = await client.post(
        f"/api/v1/vendors/submissions/{sub_id}/review",
        json={
            "decision": "APPROVED",
            "participant_feedback": "Great detailed review!"
        },
        headers={"Authorization": f"Bearer {v_token}"}
    )
    assert review_resp.status_code == 200

    # 7. Check participant wallet balance (should have ₹120 credited)
    wallet_resp = await client.get("/api/v1/wallet/summary", headers={"Authorization": f"Bearer {p_token}"})
    assert wallet_resp.status_code == 200
    assert wallet_resp.json()["current_balance"] == 120.0
