"""
OpenRouter API client for Grok-4 integration.
Handles chat completions with streaming support and retry logic.
"""
import asyncio
import httpx
from typing import AsyncGenerator, Dict, Any, Optional
from app.core.config import settings
from app.core.security import sanitize_prompt


class OpenRouterClient:
    """Client for OpenRouter API with Grok-4 model."""
    
    def __init__(self):
        self.base_url = settings.OPENROUTER_BASE_URL
        self.api_key = settings.OPENROUTER_API_KEY
        self.model = settings.OPENROUTER_MODEL
        self.client = httpx.AsyncClient(timeout=60.0)
    
    async def chat_completion(
        self,
        messages: list[Dict[str, str]],
        stream: bool = False,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        **kwargs
    ) -> Dict[str, Any] | AsyncGenerator[str, None]:
        """
        Send a chat completion request to OpenRouter.
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            stream: Whether to stream the response
            temperature: Sampling temperature (0-2)
            max_tokens: Maximum tokens to generate
            **kwargs: Additional parameters
        
        Returns:
            Response dict or async generator for streaming
        """
        # Sanitize all user messages
        sanitized_messages = []
        for msg in messages:
            if msg["role"] == "user":
                sanitized_messages.append({
                    "role": msg["role"],
                    "content": sanitize_prompt(msg["content"])
                })
            else:
                sanitized_messages.append(msg)
        
        payload = {
            "model": self.model,
            "messages": sanitized_messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": stream,
            **kwargs
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": settings.BACKEND_URL,
            "X-Title": "AI Dev Platform",
        }
        
        if stream:
            return self._stream_completion(payload, headers)
        else:
            return await self._complete(payload, headers)
    
    async def _complete(self, payload: Dict, headers: Dict) -> Dict[str, Any]:
        """Non-streaming completion with retry logic."""
        max_retries = 3
        retry_delay = 1
        
        for attempt in range(max_retries):
            try:
                response = await self.client.post(
                    f"{self.base_url}/chat/completions",
                    json=payload,
                    headers=headers
                )
                response.raise_for_status()
                return response.json()
            
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429:  # Rate limit
                    if attempt < max_retries - 1:
                        await asyncio.sleep(retry_delay * (2 ** attempt))
                        continue
                raise
            
            except httpx.RequestError as e:
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay)
                    continue
                raise
        
        raise Exception("Max retries exceeded")
    
    async def _stream_completion(
        self,
        payload: Dict,
        headers: Dict
    ) -> AsyncGenerator[str, None]:
        """Stream completion tokens as they arrive."""
        async with self.client.stream(
            "POST",
            f"{self.base_url}/chat/completions",
            json=payload,
            headers=headers
        ) as response:
            response.raise_for_status()
            
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]  # Remove "data: " prefix
                    
                    if data == "[DONE]":
                        break
                    
                    try:
                        import json
                        chunk = json.loads(data)
                        
                        if "choices" in chunk and len(chunk["choices"]) > 0:
                            delta = chunk["choices"][0].get("delta", {})
                            content = delta.get("content", "")
                            
                            if content:
                                yield content
                    
                    except json.JSONDecodeError:
                        continue
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


# Global client instance
openrouter_client = OpenRouterClient()
