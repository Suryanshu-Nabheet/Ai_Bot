"""
Rate limiting middleware using Redis.
Implements token bucket algorithm per user.
"""
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.redis import redis_client
from app.core.config import settings
import time


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware to rate limit API requests per user."""
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks and metrics
        if request.url.path in ["/health", "/metrics", "/"]:
            return await call_next(request)
        
        # Get user ID from request (from JWT token in Authorization header)
        user_id = await self._get_user_id(request)
        
        if user_id:
            # Check rate limit
            is_allowed = await self._check_rate_limit(user_id)
            
            if not is_allowed:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded. Please try again later."
                )
        
        response = await call_next(request)
        return response
    
    async def _get_user_id(self, request: Request) -> str | None:
        """Extract user ID from JWT token."""
        auth_header = request.headers.get("Authorization")
        
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
        
        token = auth_header.split(" ")[1]
        
        try:
            from app.core.security import decode_access_token
            payload = decode_access_token(token)
            return payload.get("sub")
        except Exception:
            return None
    
    async def _check_rate_limit(self, user_id: str) -> bool:
        """
        Check if user is within rate limit using token bucket algorithm.
        
        Args:
            user_id: User identifier
        
        Returns:
            True if request is allowed, False if rate limited
        """
        key = f"rate_limit:{user_id}"
        window = settings.RATE_LIMIT_WINDOW_MS // 1000  # Convert to seconds
        max_requests = settings.RATE_LIMIT_MAX_REQUESTS
        
        current_time = int(time.time())
        
        # Use Redis pipeline for atomic operations
        pipe = redis_client.pipeline()
        
        # Remove old entries outside the window
        pipe.zremrangebyscore(key, 0, current_time - window)
        
        # Count requests in current window
        pipe.zcard(key)
        
        # Add current request
        pipe.zadd(key, {str(current_time): current_time})
        
        # Set expiration
        pipe.expire(key, window)
        
        results = await pipe.execute()
        request_count = results[1]
        
        return request_count < max_requests
