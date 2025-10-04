"""
Chat API endpoints for conversational AI interactions.
Supports both streaming and non-streaming responses.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional
import json

from app.core.database import get_db
from app.services.openrouter import openrouter_client
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    project_id: Optional[str] = None
    stream: bool = True
    temperature: float = 0.7
    max_tokens: int = 4096


class ChatResponse(BaseModel):
    message: str
    usage: Optional[dict] = None


@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Send a chat message and get a response from Grok-4.
    Non-streaming endpoint.
    """
    try:
        # Convert Pydantic models to dicts
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        # Call OpenRouter
        response = await openrouter_client.chat_completion(
            messages=messages,
            stream=False,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        # Extract response
        message_content = response["choices"][0]["message"]["content"]
        usage = response.get("usage", {})
        
        # TODO: Save chat message to database
        # TODO: Update user usage metrics
        
        return ChatResponse(message=message_content, usage=usage)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat error: {str(e)}"
        )


@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Send a chat message and stream the response from Grok-4.
    Uses Server-Sent Events (SSE) for streaming.
    """
    async def event_generator():
        try:
            messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
            
            stream = await openrouter_client.chat_completion(
                messages=messages,
                stream=True,
                temperature=request.temperature,
                max_tokens=request.max_tokens
            )
            
            async for token in stream:
                # Send token as SSE event
                yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
            
            # Send completion event
            yield f"data: {json.dumps({'type': 'complete'})}\n\n"
        
        except Exception as e:
            # Send error event
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@router.get("/history")
async def get_chat_history(
    project_id: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get chat history for a user or project."""
    # TODO: Implement database query for chat history
    return {"messages": [], "total": 0}
