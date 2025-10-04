"""
Code generation API endpoints.
Handles task planning and code generation using Grok-4.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json

from app.core.database import get_db
from app.services.task_planner import task_planner
from app.services.openrouter import openrouter_client
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


class GeneratePlanRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = None


class GeneratePlanResponse(BaseModel):
    plan: Dict[str, Any]


class ExecuteGenerationRequest(BaseModel):
    project_id: str
    plan: Dict[str, Any]


CODE_GENERATION_SYSTEM_PROMPT = """You are an expert software engineer.
Generate clean, production-ready code based on the task description.

Rules:
1. Output ONLY code in triple backticks with file path
2. Follow framework best practices and conventions
3. Include proper TypeScript types and error handling
4. Add brief comments for complex logic
5. Use modern syntax and patterns
6. Never include API keys or secrets

Format:
