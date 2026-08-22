from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class MissionSubmissionAnswerSchema(BaseModel):
    question_id: str
    answer_text: Optional[str] = None
    answer_json: Optional[Dict[str, Any]] = None

class ProofArtifactCreateSchema(BaseModel):
    artifact_type: str = "IMAGE" # IMAGE, VIDEO, SCREENSHOT, RECEIPT, QR_CODE, FILE, URL
    file_url: str
    file_name: str
    file_size_bytes: int = 0
    metadata_json: Optional[Dict[str, Any]] = {}

class MissionSubmitRequest(BaseModel):
    answers: Optional[List[MissionSubmissionAnswerSchema]] = []
    proof_artifacts: List[ProofArtifactCreateSchema]

class SubmissionReviewRequest(BaseModel):
    decision: str # APPROVED, REJECTED, CLARIFICATION_REQUESTED
    rejection_reason_code: Optional[str] = None
    internal_notes: Optional[str] = None
    participant_feedback: Optional[str] = None

class MissionResponse(BaseModel):
    id: str
    campaign_id: str
    campaign_title: str
    vendor_name: str
    template_type: str
    status: str
    reward_amount: float
    reserved_at: datetime
    expires_at: datetime
    submitted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
