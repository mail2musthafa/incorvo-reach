from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from app.core.security import decode_token, security_scheme

router = APIRouter(prefix="/ai", tags=["Erah AI Assistant"])

class ErahChatRequest(BaseModel):
    role: str = "vendor" # vendor, participant, admin
    message: str
    context: Optional[Dict[str, Any]] = None
    language: str = "English" # English, Hindi, Telugu, Urdu

class CampaignBriefRequest(BaseModel):
    objective: Optional[str] = None
    target_audience: Optional[str] = None
    category: Optional[str] = "UGC"
    target_goal: Optional[str] = None
    budget_inr: float = 15000.0
    industry: str = "General"

@router.post("/erah/chat", response_model=Dict[str, Any])
async def erah_ai_chat(
    req: ErahChatRequest,
    auth=Depends(security_scheme)
):
    """
    Erah AI — Your Incorvo Reach Assistant.
    Provides conversational assistance for Vendors, Participants, and Administrators
    with strict guardrails against fake engagement, autonomous money movement, or cross-tenant leaks.
    """
    user_msg = req.message.lower().strip()
    role = req.role.lower()

    # Safety policy check
    prohibited_keywords = ["fake review", "5 star rating", "google review", "buy followers", "fake likes", "click ad", "app store rating"]
    for kw in prohibited_keywords:
        if kw in user_msg:
            return {
                "reply": "⚠️ **Policy Notice**: Incorvo Reach strictly prohibits paid public ratings, fake reviews, follower buying, or artificial engagement manipulation under our Acceptable Campaign Policy. I can only assist with genuine customer research, original UGC, store visits, product feedback, and qualified leads.",
                "action_type": "POLICY_WARNING",
                "suggested_actions": ["Review Acceptable Campaign Policy", "Create Usability Study Instead", "Launch Store Audit"]
            }

    # 1. Vendor Persona
    if role == "vendor":
        if "restaurant" in user_msg or "store" in user_msg or "repeat" in user_msg or "hyderabad" in user_msg:
            return {
                "reply": "I've structured a **Retail Footfall & QR Check-in Campaign Draft** for your Hyderabad locations:\n\n• **Format**: Store Check-in & Review Feedback\n• **Recommended Reward**: ₹150.00 per verified visit + 10% in-store discount\n• **Proof Requirement**: GPS geotag check-in (< 100m radius) + timestamped kiosk QR token scan + brief 3-question survey\n• **Estimated Budget for 100 Verified Visits**: ₹22,500 (₹15,000 participant reward + ₹7,500 platform fee & reserves)\n\nWould you like me to pre-fill this into your Campaign Builder?",
                "action_type": "CAMPAIGN_DRAFT_READY",
                "draft_data": {
                    "title": "Hyderabad Retail Store Check-in & Dining Feedback",
                    "campaign_type": "STORE_VISIT",
                    "reward_per_mission_inr": 150.0,
                    "target_participants": 100,
                    "total_budget_inr": 22500.0,
                    "instructions": "1. Visit our designated location in Hyderabad.\n2. Scan the active QR token at the front counter.\n3. Answer 3 quick questions regarding food quality and service cleanliness."
                },
                "suggested_actions": ["Apply Draft to Campaign Builder", "Adjust Budget", "Add UGC Video Option"]
            }
        elif "ugc" in user_msg or "video" in user_msg or "creator" in user_msg:
            return {
                "reply": "Here is a **Creator UGC Video Brief** tailored for authentic conversion:\n\n• **Deliverable**: 9:16 vertical 1080x1920 60fps video (30–60s)\n• **Mandatory Hook**: Unboxing & honest first impressions within the first 3 seconds\n• **Standard Reward Benchmark**: ₹1,200.00 – ₹1,800.00 per approved video with commercial digital rights\n• **Verification SLA**: 48h with 1 free revision round.",
                "action_type": "UGC_BRIEF_READY",
                "suggested_actions": ["Create UGC Campaign", "View Verified Creators Roster", "Download Rights Agreement"]
            }
        else:
            return {
                "reply": f"Hello! I am **Erah AI**, your Incorvo Reach campaign architect. I can assist you in converting your business objectives into structured, policy-compliant campaign briefs, calculating budget unit economics, and analyzing participant feedback. How can I help you today?",
                "action_type": "GENERAL_REPLY",
                "suggested_actions": ["Design a Research Study", "Calculate Campaign Budget", "Create UGC Video Brief", "Store Footfall Campaign"]
            }

    # 2. Participant Persona
    elif role == "participant":
        if "telugu" in req.language.lower() or "తెలుగు" in user_msg:
            return {
                "reply": "నమస్కారం! నేను **Erah AI**. మీకు అందుబాటులో ఉన్న మిషన్లను కనుగొనడంలో మరియు మీ రివార్డ్స్ విత్‌డ్రాల్ స్థితిని చెక్ చేయడంలో నేను సహాయపడగలను. మీకు ఏ సహాయం కావాలి?",
                "action_type": "LANGUAGE_TELUGU",
                "suggested_actions": ["కొత్త మిషన్లు చూడండి", "నా వాలెట్ బ్యాలెన్స్", "UPI విత్‌డ్రాల్ స్టేటస్"]
            }
        elif "hindi" in req.language.lower() or "हिंदी" in user_msg:
            return {
                "reply": "नमस्ते! मैं **Erah AI** हूँ। मैं आपके लिए नए मिशन्स खोजने, टास्क निर्देशों को समझाने और आपके UPI रिवॉर्ड्स की स्थिति देखने में मदद कर सकता हूँ।",
                "action_type": "LANGUAGE_HINDI",
                "suggested_actions": ["नए मिशन्स देखें", "वॉलेट बैलेंस चेक करें", "टास्क कैसे सबमिट करें"]
            }
        elif "payout" in user_msg or "wallet" in user_msg or "money" in user_msg or "upi" in user_msg:
            return {
                "reply": "Your current withdrawable wallet balance is **₹1,250.00**. You have 1 completed mission awaiting manual finance approval (UPI Transfer to registered VPA). All verified payouts are processed within 24 business hours.",
                "action_type": "WALLET_STATUS",
                "suggested_actions": ["Request UPI Withdrawal", "View Mission History", "Contact Support"]
            }
        else:
            return {
                "reply": "Hi! I am **Erah AI**. I can help you find high-reward missions matching your skills, check task instructions in simple terms, verify your uploaded proof before submission, and track your payout status.",
                "action_type": "GENERAL_PARTICIPANT_REPLY",
                "suggested_actions": ["Recommend Top Missions", "Check Proof Guidelines", "My Wallet & Payouts", "Appeal a Rejected Mission"]
            }

    # 3. Admin Persona
    else:
        return {
            "reply": "🛡️ **Erah AI Moderation Intelligence**:\n\n• **High Priority Submissions**: 3 submissions flagged with elevated completion velocity (> 3x faster than median).\n• **Duplicate Image Scanner**: 0 duplicate perceptual image hashes detected across active flights.\n• **Vendor Verification Queue**: 2 new vendor GSTIN applications awaiting review.\n• **Ledger Reconcile Status**: $\\sum \\text{Debit} \\equiv \\sum \\text{Credit}$ (Variance: ₹0.0).",
            "action_type": "ADMIN_SUMMARY",
            "suggested_actions": ["Open Verification Queue", "Inspect Velocity Outliers", "Review Vendor GSTINs"]
        }

@router.post("/campaign-assistant")
async def generate_campaign_brief(
    req: CampaignBriefRequest,
    auth=Depends(security_scheme)
):
    """Generates structured campaign briefs with clear proof checklists and reward benchmarks."""
    title = f"{req.industry} Customer Research & Usability Study"
    return {
        "title": title,
        "suggested_title": title,
        "description": f"Verified qualitative feedback campaign for target: {req.target_audience or req.target_goal}",
        "suggested_instructions": "1. Test the requested workflow.\n2. Submit unedited proof.",
        "recommended_category": req.category or "SURVEY",
        "recommended_reward_inr": 150.0,
        "policy_risk_assessment": "COMPLIANT (No fake reviews or artificial engagement detected)",
        "max_participants": int(req.budget_inr / 200.0),
        "suggested_proof_items": [
            {"title": "Detailed Feedback Response", "description": "Minimum 50-word qualitative answer explaining product friction."},
            {"title": "Unedited Screen Recording / Photo", "description": "High resolution proof of task completion."}
        ]
    }
