from typing import Dict, Any, List, Optional
import uuid

class ErahInternalTools:
    # --- VENDOR TOOLS ---
    @staticmethod
    async def get_vendor_profile(vendor_id: str) -> Dict[str, Any]:
        return {
            "vendor_id": vendor_id,
            "legal_name": "Nova Nutrition Private Limited",
            "tier": "VERIFIED_DESIGN_PARTNER",
            "available_funds_inr": 45000.0,
            "active_campaigns_count": 3
        }

    @staticmethod
    async def create_campaign_draft(
        vendor_id: str,
        title: str,
        category: str,
        reward_inr: float,
        target_participants: int,
        instructions: str
    ) -> Dict[str, Any]:
        draft_id = f"cmp_draft_{uuid.uuid4().hex[:8]}"
        total_escrow = (reward_inr * target_participants) * 1.35
        return {
            "draft_id": draft_id,
            "title": title,
            "category": category,
            "reward_per_action_inr": reward_inr,
            "target_participants": target_participants,
            "estimated_total_escrow_inr": total_escrow,
            "instructions": instructions,
            "status": "DRAFT",
            "requires_approval_to_publish": True
        }

    @staticmethod
    async def calculate_campaign_budget(
        category: str,
        target_outcomes: int,
        vendor_unit_price: float,
        participant_reward: float
    ) -> Dict[str, Any]:
        gross = target_outcomes * vendor_unit_price
        rewards = target_outcomes * participant_reward
        pg = gross * 0.02
        mod = target_outcomes * (1.0 if category == "AWARENESS" else 15.0 if category == "SURVEY" else 65.0 if category == "UGC" else 20.0)
        reserve = gross * 0.03
        net = gross - rewards - pg - mod - reserve
        margin = (net / gross * 100.0) if gross > 0 else 0.0
        return {
            "gross_budget_inr": gross,
            "total_rewards_inr": rewards,
            "payment_gateway_inr": pg,
            "verification_sla_inr": mod,
            "fraud_reserve_inr": reserve,
            "net_contribution_inr": net,
            "contribution_margin_percent": round(margin, 1)
        }

    # --- PARTICIPANT TOOLS ---
    @staticmethod
    async def search_eligible_missions(user_id: str, locale: str = "en-IN") -> List[Dict[str, Any]]:
        return [
            {
                "mission_id": "msn_101",
                "title": "Clean-Label Snack Taste Usability Study",
                "category": "SURVEY",
                "reward_inr": 150.0,
                "time_estimate_mins": 8,
                "prerequisites": "Verified Phone & Age 18+"
            },
            {
                "mission_id": "msn_102",
                "title": "Morning Routine UGC Video Deliverable",
                "category": "UGC",
                "reward_inr": 1200.0,
                "time_estimate_mins": 25,
                "prerequisites": "Gold Creator Badge"
            },
            {
                "mission_id": "msn_103",
                "title": "Hyderabad Gourmet Retail Store Audit",
                "category": "STORE_VISIT",
                "reward_inr": 250.0,
                "time_estimate_mins": 15,
                "prerequisites": "Within 5km Geofence"
            }
        ]

    @staticmethod
    async def get_reward_status(user_id: str) -> Dict[str, Any]:
        return {
            "user_id": user_id,
            "withdrawable_balance_inr": 1250.0,
            "pending_verification_inr": 350.0,
            "total_lifetime_earned_inr": 4850.0,
            "default_payout_vpa": "user@okhdfcbank"
        }

    # --- KNOWLEDGE TOOLS ---
    @staticmethod
    async def search_knowledge(query: str, locale: str = "en-IN") -> Dict[str, Any]:
        return {
            "sources": [
                "Acceptable Campaign Policy §2.1",
                "Campaign Operations Handbook (2026)",
                "DPDP Privacy Governance Charter"
            ],
            "verified_answer_summary": "Incorvo Reach operates exclusively on authentic, verified business outcomes. Paid public reviews, artificial followers, and click manipulation are strictly prohibited."
        }
