"""
Redis client configuration for caching and rate limiting.
"""
import redis.asyncio as redis
from app.core.config import settings

# Create Redis client
redis_client = redis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
    max_connections=50,
)


async def get_redis():
    """Dependency to get Redis client."""
    return redis_client
