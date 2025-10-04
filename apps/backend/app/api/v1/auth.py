"""
Authentication API endpoints.
Handles GitHub OAuth, Google OAuth, and JWT token management.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
import httpx

from app.core.database import get_db
from app.core.config import settings
from app.core.security import create_access_token
from app.models.user import User

router = APIRouter()


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.get("/github")
async def github_login():
    """Redirect to GitHub OAuth."""
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={settings.GITHUB_CALLBACK_URL}"
        f"&scope=user:email,repo"
    )
    return {"url": github_auth_url}


@router.get("/callback/github")
async def github_callback(
    code: str,
    db: AsyncSession = Depends(get_db)
):
    """Handle GitHub OAuth callback."""
    try:
        # Exchange code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "client_id": settings.GITHUB_CLIENT_ID,
                    "client_secret": settings.GITHUB_CLIENT_SECRET,
                    "code": code,
                },
                headers={"Accept": "application/json"}
            )
            token_data = token_response.json()
            github_token = token_data.get("access_token")
            
            if not github_token:
                raise HTTPException(status_code=400, detail="Failed to get GitHub token")
            
            # Get user info from GitHub
            user_response = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {github_token}"}
            )
            github_user = user_response.json()
            
            # TODO: Create or update user in database
            # For now, create a mock user
            user_data = {
                "id": str(github_user["id"]),
                "email": github_user.get("email", f"{github_user['login']}@github.com"),
                "name": github_user.get("name", github_user["login"]),
                "avatar": github_user.get("avatar_url"),
                "github_id": str(github_user["id"]),
            }
            
            # Create JWT token
            access_token = create_access_token(data={"sub": user_data["id"]})
            
            return TokenResponse(
                access_token=access_token,
                user=user_data
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )


@router.get("/me")
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current authenticated user info."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "avatar": current_user.avatar,
    }


@router.post("/logout")
async def logout(response: Response):
    """Logout user by clearing cookies."""
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}
