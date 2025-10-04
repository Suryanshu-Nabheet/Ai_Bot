"""
Application configuration using Pydantic settings.
Loads environment variables and provides typed configuration.
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "Ai Bot "
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=True, env="DEBUG")
    
    # API URLs
    BACKEND_URL: str = Field(default="http://localhost:8000", env="BACKEND_URL")
    FRONTEND_URL: str = Field(default="http://localhost:3000", env="FRONTEND_URL")
    
    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:8000"],
        env="CORS_ORIGINS"
    )
    
    # Database
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    
    # Redis
    REDIS_URL: str = Field(..., env="REDIS_URL")
    
    # JWT & Sessions
    JWT_SECRET: str = Field(..., env="JWT_SECRET")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24 * 7  # 7 days
    SESSION_SECRET: str = Field(..., env="SESSION_SECRET")
    
    # OpenRouter (Grok-4)
    OPENROUTER_API_KEY: str = Field(..., env="OPENROUTER_API_KEY")
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_MODEL: str = "xai/grok-beta"
    
    # GitHub OAuth
    GITHUB_CLIENT_ID: str = Field(..., env="GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET: str = Field(..., env="GITHUB_CLIENT_SECRET")
    GITHUB_CALLBACK_URL: str = Field(..., env="GITHUB_CALLBACK_URL")
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = Field(..., env="GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = Field(..., env="GOOGLE_CLIENT_SECRET")
    GOOGLE_CALLBACK_URL: str = Field(..., env="GOOGLE_CALLBACK_URL")
    
    # Vercel
    VERCEL_TOKEN: str = Field(default="", env="VERCEL_TOKEN")
    VERCEL_TEAM_ID: str = Field(default="", env="VERCEL_TEAM_ID")
    
    # Netlify
    NETLIFY_TOKEN: str = Field(default="", env="NETLIFY_TOKEN")
    
    # Sentry
    SENTRY_DSN: str = Field(default="", env="SENTRY_DSN")
    
    # Rate Limiting
    RATE_LIMIT_MAX_REQUESTS: int = Field(default=100, env="RATE_LIMIT_MAX_REQUESTS")
    RATE_LIMIT_WINDOW_MS: int = Field(default=900000, env="RATE_LIMIT_WINDOW_MS")
    
    # Sandbox
    SANDBOX_TIMEOUT_MS: int = Field(default=30000, env="SANDBOX_TIMEOUT_MS")
    SANDBOX_MEMORY_LIMIT_MB: int = Field(default=512, env="SANDBOX_MEMORY_LIMIT_MB")
    SANDBOX_CPU_LIMIT: int = Field(default=1, env="SANDBOX_CPU_LIMIT")
    
    # Feature Flags
    ENABLE_SANDBOX_EXECUTION: bool = Field(default=True, env="ENABLE_SANDBOX_EXECUTION")
    ENABLE_AUTO_DEPLOY: bool = Field(default=True, env="ENABLE_AUTO_DEPLOY")
    ENABLE_GITHUB_INTEGRATION: bool = Field(default=True, env="ENABLE_GITHUB_INTEGRATION")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
