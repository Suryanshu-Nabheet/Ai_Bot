"""
Tests for OpenRouter integration.
"""
import pytest
from unittest.mock import AsyncMock, patch
from app.services.openrouter import OpenRouterClient


@pytest.mark.asyncio
async def test_chat_completion():
    """Test non-streaming chat completion."""
    client = OpenRouterClient()
    
    with patch.object(client.client, 'post', new_callable=AsyncMock) as mock_post:
        mock_post.return_value.json.return_value = {
            "choices": [{"message": {"content": "Hello!"}}],
            "usage": {"total_tokens": 10}
        }
        
        response = await client.chat_completion(
            messages=[{"role": "user", "content": "Hi"}],
            stream=False
        )
        
        assert response["choices"][0]["message"]["content"] == "Hello!"
        assert mock_post.called


@pytest.mark.asyncio
async def test_prompt_sanitization():
    """Test that API keys are sanitized from prompts."""
    from app.core.security import sanitize_prompt
    
    prompt = "Use this API key: sk-1234567890abcdef to connect"
    sanitized = sanitize_prompt(prompt)
    
    assert "sk-1234567890abcdef" not in sanitized
    assert "[REDACTED]" in sanitized
