"""
Sandbox execution API endpoints.
Handles running code in isolated Docker containers.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


class ExecuteRequest(BaseModel):
    project_id: str
    command: str


@router.post("/execute")
async def execute_command(
    request: ExecuteRequest,
    current_user: User = Depends(get_current_user)
):
    """Execute a command in a sandboxed environment."""
    # TODO: Implement Docker sandbox execution
    return {"output": "Command executed successfully", "exit_code": 0}
