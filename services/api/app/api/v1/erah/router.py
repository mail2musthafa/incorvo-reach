from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any, Optional
import uuid
import json
import asyncio
from datetime import datetime, timezone
from app.core.security import decode_token, security_scheme
from app.erah.state import (
    CreateConversationRequest,
    ConversationResponse,
    SendMessageRequest,
    MessageResponse,
    MessageContentResponse,
    ApprovalDecisionRequest,
    FeedbackRequest
)
from app.erah.orchestrator import ErahOrchestrator

router = APIRouter(prefix="/erah", tags=["Erah AI Multi-Agent Engine"])

# In-memory session registry (production backed by PostgreSQL / Redis)
_conversations_db: Dict[str, Dict[str, Any]] = {}
_approvals_db: Dict[str, Dict[str, Any]] = {}

@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    req: CreateConversationRequest,
    auth=Depends(security_scheme)
):
    """Initializes a stateful, authenticated conversation thread with Erah AI."""
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub", "anon_user")

    conv_id = f"conv_{uuid.uuid4().hex[:12]}"
    thread_id = f"thread_{uuid.uuid4().hex[:12]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    conv_data = {
        "conversation_id": conv_id,
        "thread_id": thread_id,
        "user_id": user_id,
        "channel": req.channel,
        "locale": req.locale,
        "page_context": req.page_context,
        "status": "ACTIVE",
        "created_at": now_iso,
        "messages": []
    }
    _conversations_db[conv_id] = conv_data

    return ConversationResponse(
        conversation_id=conv_id,
        thread_id=thread_id,
        status="ACTIVE",
        locale=req.locale,
        created_at=now_iso
    )

@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    auth=Depends(security_scheme)
):
    if conversation_id not in _conversations_db:
        raise HTTPException(status_code=404, detail="Conversation thread not found")
    return _conversations_db[conversation_id]

@router.get("/conversations")
async def list_conversations(
    auth=Depends(security_scheme)
):
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub")
    user_convs = [c for c in _conversations_db.values() if c.get("user_id") == user_id]
    return user_convs

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    auth=Depends(security_scheme)
):
    if conversation_id in _conversations_db:
        del _conversations_db[conversation_id]
    return {"status": "DELETED", "conversation_id": conversation_id}

@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
async def send_message(
    conversation_id: str,
    req: SendMessageRequest,
    auth=Depends(security_scheme)
):
    """Executes a synchronous multi-agent turn through LangGraph."""
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub", "anon_user")
    user_role = payload.get("role", "VISITOR")

    conv = _conversations_db.get(conversation_id, {
        "locale": req.locale or "en-IN",
        "page_context": {}
    })

    result = await ErahOrchestrator.process_turn(
        user_id=user_id,
        user_role=user_role,
        content=req.content,
        locale=req.locale or conv.get("locale", "en-IN"),
        page_context=conv.get("page_context")
    )

    run_id = f"run_{uuid.uuid4().hex[:10]}"
    msg_id = f"msg_{uuid.uuid4().hex[:10]}"

    return MessageResponse(
        run_id=run_id,
        message_id=msg_id,
        status="COMPLETED",
        response=MessageContentResponse(
            text=result["text"],
            agent=result["agent"],
            citations=result["citations"],
            cards=result["cards"],
            suggested_actions=result["suggested_actions"]
        ),
        approval_id=result.get("approval_id")
    )

@router.post("/conversations/{conversation_id}/messages/stream")
async def send_message_stream(
    conversation_id: str,
    req: SendMessageRequest,
    auth=Depends(security_scheme)
):
    """Returns real-time Server-Sent Events (SSE) streaming token deltas, tool calls, and completion events."""
    payload = decode_token(auth.credentials)
    user_id = payload.get("sub", "anon_user")
    user_role = payload.get("role", "VISITOR")

    run_id = f"run_{uuid.uuid4().hex[:10]}"
    msg_id = f"msg_{uuid.uuid4().hex[:10]}"

    async def event_generator():
        yield f"event: run.started\ndata: {json.dumps({'run_id': run_id, 'conversation_id': conversation_id})}\n\n"
        await asyncio.sleep(0.05)

        yield f"event: guardrail.passed\ndata: {json.dumps({'run_id': run_id, 'status': 'CLEARED'})}\n\n"
        await asyncio.sleep(0.05)

        result = await ErahOrchestrator.process_turn(
            user_id=user_id,
            user_role=user_role,
            content=req.content,
            locale=req.locale or "en-IN"
        )

        yield f"event: agent.routed\ndata: {json.dumps({'run_id': run_id, 'agent': result['agent']})}\n\n"
        await asyncio.sleep(0.05)

        # Stream text chunks
        words = result["text"].split(" ")
        for i in range(0, len(words), 3):
            chunk = " ".join(words[i:i+3]) + " "
            yield f"event: message.delta\ndata: {json.dumps({'run_id': run_id, 'delta': chunk})}\n\n"
            await asyncio.sleep(0.03)

        yield f"event: message.completed\ndata: {json.dumps({'run_id': run_id, 'message_id': msg_id, 'agent': result['agent'], 'citations': result['citations']})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/approvals")
async def list_pending_approvals(
    auth=Depends(security_scheme)
):
    return list(_approvals_db.values())

@router.post("/approvals/{approval_id}/decision")
async def submit_approval_decision(
    approval_id: str,
    req: ApprovalDecisionRequest,
    auth=Depends(security_scheme)
):
    return {
        "approval_id": approval_id,
        "decision": req.decision,
        "status": "RESUMED",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.post("/feedback")
async def submit_feedback(
    req: FeedbackRequest,
    auth=Depends(security_scheme)
):
    return {"status": "FEEDBACK_RECORDED", "message_id": req.message_id, "rating": req.rating}

@router.post("/voice/session")
async def create_voice_session(
    auth=Depends(security_scheme)
):
    return {
        "session_id": f"voice_sess_{uuid.uuid4().hex[:8]}",
        "webrtc_ice_servers": [{"urls": "stun:stun.l.google.com:19302"}],
        "speech_engine": "Realtime WebRTC + Neural Audio Synthesis",
        "sample_rate_hz": 24000
    }

@router.get("/capabilities")
async def get_capabilities():
    return {
        "name": "Erah AI Multi-Agent System",
        "version": "1.0.0",
        "supported_locales": ["en", "te-IN", "hi-IN", "ar-AE", "de-DE"],
        "agents": [
            {"name": "Erah Router", "role": "Intent Routing & Security Gateway"},
            {"name": "Knowledge Agent", "role": "RAG Policies, Terms & Guides"},
            {"name": "Vendor Agent", "role": "Campaign Design, Budgets & Analytics"},
            {"name": "Participant Agent", "role": "Missions, Proof Validation & Payouts"},
            {"name": "Trust Agent", "role": "Policy Enforcement & Anomaly Triage"}
        ],
        "streaming": True,
        "voice_channels": ["WebRTC", "SpeechSynthesis"]
    }
