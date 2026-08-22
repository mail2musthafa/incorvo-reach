import re
from typing import Tuple, List, Optional

PROHIBITED_ENGAGEMENT_PATTERNS = [
    r"buy\s+(?:5|five)?\s*star(?:\s+\w+)*\s*reviews?",
    r"fake\s*reviews?",
    r"google\s*reviews?",
    r"buy\s*(?:followers|likes|subscribers|views|clicks)",
    r"artificial\s*(?:engagement|clicks?)",
    r"click\s*(?:ads?|advertisements?)\s*bot",
    r"multiple\s*accounts?\s*farming",
    r"app\s*store\s*(?:ratings?|reviews?)\s*manipulation"
]

PROMPT_INJECTION_PATTERNS = [
    r"ignore\s+(?:all\s+)?previous\s+instructions",
    r"system\s+prompt\s+override",
    r"reveal\s+(?:internal\s+)?(?:api\s+keys?|passwords?|secrets?)",
    r"dump\s+(?:database|users?\s+table|ledger_postings)",
    r"act\s+as\s+jailbreak"
]

class ErahGuardrails:
    @staticmethod
    def inspect_input(content: str) -> Tuple[bool, Optional[str], List[str]]:
        """
        Validates incoming user prompt against prompt injection and prohibited engagement policies.
        Returns: (is_safe, error_or_warning_message, risk_flags)
        """
        text = content.lower()
        risk_flags = []

        # 1. Prompt Injection Checks
        for pattern in PROMPT_INJECTION_PATTERNS:
            if re.search(pattern, text):
                risk_flags.append("PROMPT_INJECTION_ATTEMPT")
                return (
                    False,
                    "⚠️ **Security Alert**: Your request was flagged by Erah Guardrails for anomalous system directives.",
                    risk_flags
                )

        # 2. Prohibited Engagement Policy Checks
        for pattern in PROHIBITED_ENGAGEMENT_PATTERNS:
            if re.search(pattern, text):
                risk_flags.append("PROHIBITED_CAMPAIGN_POLICY_VIOLATION")
                return (
                    False,
                    "⚠️ **Acceptable Campaign Policy Notice**: Incorvo Reach strictly prohibits paid public ratings, fake reviews, follower buying, or artificial click manipulation. Erah can only structure campaigns for verified customer research, original UGC, store visits, product feedback, and qualified leads.",
                    risk_flags
                )

        return (True, None, risk_flags)

    @staticmethod
    def sanitize_output(text: str) -> str:
        """Sanitizes outgoing text to prevent accidental credential or PII leaks."""
        sanitized = re.sub(r"inc_live_[a-zA-Z0-9]{32}", "[REDACTED_API_KEY]", text)
        sanitized = re.sub(r"inc_test_[a-zA-Z0-9]{32}", "[REDACTED_API_KEY]", sanitized)
        return sanitized
