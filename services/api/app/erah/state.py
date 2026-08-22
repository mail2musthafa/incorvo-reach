from typing import Annotated, Literal, Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class ErahAssistantMeta(BaseModel):
    name: str = "Erah AI"
    greeting: str = "Hi! I’m Erah. How can I help you today?"

class CreateConversationRequest(BaseModel):
    channel: str = "WEB" # WEB, MOBILE, VOICE, EMBEDDED
    locale: str = "en-IN" # en, te-IN, hi-IN, ar-AE, de-DE
    page_context: Optional[Dict[str, Any]] = None

class ConversationResponse(BaseModel):
    conversation_id: str
    thread_id: str
    status: str = "ACTIVE"
    assistant: ErahAssistantMeta = Field(default_factory=ErahAssistantMeta)
    locale: str = "en-IN"
    created_at: str

class SendMessageRequest(BaseModel):
    client_message_id: Optional[str] = None
    content: str
    attachments: Optional[List[Dict[str, Any]]] = []
    locale: Optional[str] = "en-IN"

class ActionCard(BaseModel):
    type: str # CAMPAIGN_DRAFT, MISSION_CARD, PAYOUT_RECEIPT, POLICY_CITATION
    resource_id: Optional[str] = None
    title: str
    metadata: Optional[Dict[str, Any]] = None

class SuggestedAction(BaseModel):
    id: str
    label: str
    action: str # OPEN_CAMPAIGN_DRAFT, VIEW_WALLET, SUBMIT_PROOF, CONTACT_SUPPORT
    payload: Optional[Dict[str, Any]] = None

class MessageContentResponse(BaseModel):
    text: str
    agent: str # ROUTER, KNOWLEDGE_AGENT, VENDOR_AGENT, PARTICIPANT_AGENT, TRUST_AGENT
    citations: Optional[List[str]] = []
    cards: Optional[List[ActionCard]] = []
    suggested_actions: Optional[List[SuggestedAction]] = []

class MessageResponse(BaseModel):
    run_id: str
    message_id: str
    status: str = "COMPLETED" # COMPLETED, APPROVAL_REQUIRED, FAILED
    response: MessageContentResponse
    approval_id: Optional[str] = None

class ApprovalDecisionRequest(BaseModel):
    decision: Literal["APPROVE", "REJECT", "EDIT_AND_APPROVE"]
    reason: Optional[str] = None
    edited_arguments: Optional[Dict[str, Any]] = None

class FeedbackRequest(BaseModel):
    conversation_id: str
    message_id: str
    rating: Literal["HELPFUL", "UNHELPFUL"]
    comment: Optional[str] = None
