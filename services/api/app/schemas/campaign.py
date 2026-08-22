from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class QuestionCreateSchema(BaseModel):
    question_text: str
    question_type: str = "TEXT" # TEXT, SINGLE_CHOICE, MULTI_CHOICE, RATING_SCALE
    order_index: int = 0
    is_required: bool = True
    options_json: Optional[List[str]] = []

class CampaignCreateRequest(BaseModel):
    title: str
    tagline: str
    description: str
    template_type: str
    reward_per_action: float = Field(gt=0)
    total_capacity: int = Field(gt=0)
    estimated_time_minutes: int = 10
    requirements_json: Optional[Dict[str, Any]] = {}
    proof_instructions: str
    verification_method: str = "MANUAL_REVIEW"
    target_audience_json: Optional[Dict[str, Any]] = {}
    questions: Optional[List[QuestionCreateSchema]] = []

class CampaignResponse(BaseModel):
    id: str
    vendor_id: str
    vendor_name: Optional[str] = None
    title: str
    tagline: str
    description: str
    template_type: str
    status: str
    reward_per_action: float
    platform_fee_per_action: float
    total_capacity: int
    remaining_capacity: int
    total_budget: float
    budget_spent: float
    estimated_time_minutes: int
    proof_instructions: str
    verification_method: str
    target_audience_json: Optional[Dict[str, Any]] = {}
    questions: Optional[List[Dict[str, Any]]] = []
    created_at: datetime
