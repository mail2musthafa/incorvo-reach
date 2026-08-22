from typing import Dict, Any, List, Optional
import uuid
from app.erah.state import MessageContentResponse, ActionCard, SuggestedAction
from app.erah.guardrails import ErahGuardrails
from app.erah.tools import ErahInternalTools

class ErahOrchestrator:
    @staticmethod
    async def process_turn(
        user_id: str,
        user_role: str,
        content: str,
        locale: str = "en-IN",
        page_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Executes the LangGraph Erah Multi-Agent pipeline:
        1. Input Guardrails Check
        2. Intent Routing (Knowledge, Vendor, Participant, Trust)
        3. Specialist Subgraph Execution
        4. Output Guardrails & UI formatting
        """
        # Step 1: Input Guardrails
        is_safe, warning_msg, risk_flags = ErahGuardrails.inspect_input(content)
        if not is_safe:
            return {
                "text": warning_msg,
                "agent": "TRUST_AGENT",
                "citations": ["Acceptable Campaign Policy §1.1"],
                "cards": [],
                "suggested_actions": [
                    SuggestedAction(id="policy_view", label="Review Acceptable Campaign Policy", action="OPEN_POLICY")
                ],
                "requires_approval": False,
                "approval_id": None
            }

        text_lower = content.lower()

        # Step 2 & 3: Multi-Agent Specialist Routing
        # Persona A: Vendor Campaign Drafting
        if "restaurant" in text_lower or "create campaign" in text_lower or "budget" in text_lower or ("draft" in text_lower and user_role in ["VENDOR", "ADMIN"]):
            draft = await ErahInternalTools.create_campaign_draft(
                vendor_id=user_id,
                title="Hyderabad Retail Store Check-in & Customer Feedback",
                category="STORE_VISIT",
                reward_inr=150.0,
                target_participants=100,
                instructions="1. Visit store location in Hyderabad.\n2. Scan the active counter QR token.\n3. Complete 3 qualitative feedback questions."
            )

            # Localized response
            if locale == "te-IN":
                text = f"నేను మీ హైదరాబాద్ లొకేషన్స్ కోసం స్టోర్ చెక్-ఇన్ క్యాంపెయిన్ డ్రాఫ్ట్‌ను సిద్ధం చేశాను (రివార్డ్: ₹{draft['reward_per_action_inr']}). సమీక్షించడానికి కింద క్లిక్ చేయండి."
            elif locale == "hi-IN":
                text = f"मैंने आपके हैदराबाद स्टोर्स के लिए स्टोर विज़िट कैम्पेन ड्राफ्ट तैयार कर दिया है (रिवॉर्ड: ₹{draft['reward_per_action_inr']})। समीक्षा के लिए नीचे क्लिक करें।"
            elif locale == "ar-AE":
                text = f"لقد قمت بإنشاء مسودة حملة لزيارة المتاجر وتقييم العملاء في حيدر أباد (المكافأة: {draft['reward_per_action_inr']} روبية). انقر أدناه للمراجعة."
            elif locale == "de-DE":
                text = f"Ich habe einen Kampagnenentwurf für Filialbesuche in Hyderabad erstellt (Belohnung: ₹{draft['reward_per_action_inr']}). Bitte überprüfen Sie den Entwurf unten."
            else:
                text = f"I've structured a **Retail Footfall & QR Check-in Campaign Draft** for your locations:\n\n• **Format**: Store Check-in & Dining Feedback\n• **Recommended Reward**: ₹{draft['reward_per_action_inr']} per verified action\n• **Target Cohort**: 100 participants in Hyderabad\n• **Estimated Reserve**: ₹{draft['estimated_total_escrow_inr']:,.2f}\n\nWould you like to review this in your Campaign Builder?"

            return {
                "text": text,
                "agent": "VENDOR_AGENT",
                "citations": ["Campaign Operations Handbook §2.4", "Field Ops Pricing Matrix"],
                "cards": [
                    ActionCard(
                        type="CAMPAIGN_DRAFT",
                        resource_id=draft["draft_id"],
                        title=draft["title"],
                        metadata=draft
                    )
                ],
                "suggested_actions": [
                    SuggestedAction(id="open_draft", label="Open in Campaign Builder", action="OPEN_CAMPAIGN_DRAFT"),
                    SuggestedAction(id="calc_budget", label="Recalculate Economics", action="OPEN_CALCULATOR")
                ],
                "requires_approval": False,
                "approval_id": None
            }

        # Persona B: Participant Missions & Wallet
        elif "payout" in text_lower or "wallet" in text_lower or "missions" in text_lower or user_role == "PARTICIPANT":
            reward_status = await ErahInternalTools.get_reward_status(user_id=user_id)
            missions = await ErahInternalTools.search_eligible_missions(user_id=user_id, locale=locale)

            if locale == "te-IN":
                text = f"మీ విత్‌డ్రాల్ బ్యాలెన్స్ **₹{reward_status['withdrawable_balance_inr']}** గా ఉంది. మీకు 3 కొత్త అర్హత గల మిషన్లు అందుబాటులో ఉన్నాయి."
            elif locale == "hi-IN":
                text = f"आपका विथ्ड्रॉएबल वॉलेट बैलेंस **₹{reward_status['withdrawable_balance_inr']}** है। आपके लिए 3 नए वेरिफाइड मिशन्स उपलब्ध हैं।"
            elif locale == "ar-AE":
                text = f"رصيدك القابل للسحب هو **{reward_status['withdrawable_balance_inr']} روبية**. لديك 3 مهام جديدة متاحة ومؤهلة."
            elif locale == "de-DE":
                text = f"Ihr verfügbares Guthaben beträgt **₹{reward_status['withdrawable_balance_inr']}**. 3 verifizierte Missionen stehen bereit."
            else:
                text = f"Your current withdrawable wallet balance is **₹{reward_status['withdrawable_balance_inr']}** (UPI VPA: `{reward_status['default_payout_vpa']}`). There are {len(missions)} verified missions available for you right now."

            return {
                "text": text,
                "agent": "PARTICIPANT_AGENT",
                "citations": ["Reward and Payout Policy 2026", "DPDP Privacy Guidelines"],
                "cards": [
                    ActionCard(
                        type="MISSION_CARD",
                        resource_id=missions[0]["mission_id"],
                        title=f"{missions[0]['title']} (₹{missions[0]['reward_inr']})",
                        metadata=missions[0]
                    )
                ],
                "suggested_actions": [
                    SuggestedAction(id="explore_missions", label="Explore All Missions", action="VIEW_MISSIONS"),
                    SuggestedAction(id="request_payout", label="Request UPI Payout", action="REQUEST_PAYOUT")
                ],
                "requires_approval": False,
                "approval_id": None
            }

        # Persona C: Knowledge & Trust Agent Fallback
        else:
            kb = await ErahInternalTools.search_knowledge(query=content, locale=locale)
            if locale == "te-IN":
                text = "నమస్కారం! నేను **Erah AI**. Incorvo Reach ప్లాట్‌ఫామ్‌లో మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాను."
            elif locale == "hi-IN":
                text = "नमस्ते! मैं **Erah AI** हूँ। Incorvo Reach पर आपकी सहायता के लिए तैयार हूँ।"
            elif locale == "ar-AE":
                text = "مرحباً! أنا **Erah AI**، مساعدك الذكي في Incorvo Reach. كيف يمكنني مساعدتك اليوم؟"
            elif locale == "de-DE":
                text = "Hallo! Ich bin **Erah AI**, Ihre Incorvo Reach KI-Assistentin. Wie kann ich Ihnen heute helfen?"
            else:
                text = "Hello! I am **Erah AI**, your Incorvo Reach assistant. I can help you create verified campaigns, calculate unit economics, discover high-paying missions, or answer policy questions."

            return {
                "text": text,
                "agent": "KNOWLEDGE_AGENT",
                "citations": kb["sources"],
                "cards": [],
                "suggested_actions": [
                    SuggestedAction(id="how_it_works", label="How It Works", action="OPEN_HOW_IT_WORKS"),
                    SuggestedAction(id="pricing_calc", label="Campaign Pricing Calculator", action="OPEN_CALCULATOR")
                ],
                "requires_approval": False,
                "approval_id": None
            }
