"""
Main FastAPI application entry point.
Configures middleware, routes, and application lifecycle.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from prometheus_client import make_asgi_app
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import auth, chat, projects, generate, git, deploy, sandbox
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.logging import LoggingMiddleware


# Initialize Sentry if DSN is provided
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        integrations=[FastApiIntegration()],
        traces_sample_rate=0.1,
        environment=settings.ENVIRONMENT,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup and shutdown events."""
    # Startup: Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print(f"🚀 AI Dev Platform API started on {settings.BACKEND_URL}")
    print(f"📚 Docs available at {settings.BACKEND_URL}/docs")
    
    yield
    
    # Shutdown: Cleanup
    await engine.dispose()
    print("👋 AI Dev Platform API shutting down")


# Create FastAPI application
app = FastAPI(
    title="AI Dev Platform API",
    description="Production-grade AI developer platform with Grok-4 integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(LoggingMiddleware)

# Mount Prometheus metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(generate.router, prefix="/api/generate", tags=["Generation"])
app.include_router(git.router, prefix="/api/git", tags=["Git"])
app.include_router(deploy.router, prefix="/api/deploy", tags=["Deployment"])
app.include_router(sandbox.router, prefix="/api/sandbox", tags=["Sandbox"])


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "AI Dev Platform API",
        "version": "1.0.0",
        "status": "operational",
        "docs": f"{settings.BACKEND_URL}/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "environment": settings.ENVIRONMENT}
