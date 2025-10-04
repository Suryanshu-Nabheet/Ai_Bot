"""
Netlify deployment service.
Handles site creation and deployment via Netlify API.
"""
import httpx
from typing import Dict, Any, Optional
from app.core.config import settings


class NetlifyService:
    """Service for Netlify API operations."""
    
    def __init__(self, token: Optional[str] = None):
        self.token = token or settings.NETLIFY_TOKEN
        self.base_url = "https://api.netlify.com/api/v1"
        self.client = httpx.AsyncClient(
            headers={
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json",
            },
            timeout=60.0
        )
    
    async def create_site(
        self,
        name: str,
        custom_domain: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new Netlify site.
        
        Args:
            name: Site name
            custom_domain: Optional custom domain
        
        Returns:
            Site data
        """
        payload = {"name": name}
        if custom_domain:
            payload["custom_domain"] = custom_domain
        
        response = await self.client.post(
            f"{self.base_url}/sites",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    async def get_site(self, site_id: str) -> Dict[str, Any]:
        """Get site details."""
        response = await self.client.get(f"{self.base_url}/sites/{site_id}")
        response.raise_for_status()
        return response.json()
    
    async def create_deploy(
        self,
        site_id: str,
        files: Dict[str, str],
        draft: bool = False
    ) -> Dict[str, Any]:
        """
        Create a new deployment.
        
        Args:
            site_id: Site ID
            files: Dict of file paths to content
            draft: Whether this is a draft deploy
        
        Returns:
            Deploy data
        """
        import hashlib
        
        # Calculate file hashes
        file_hashes = {}
        for path, content in files.items():
            sha1 = hashlib.sha1(content.encode()).hexdigest()
            file_hashes[path] = sha1
        
        # Create deploy
        payload = {
            "files": file_hashes,
            "draft": draft,
        }
        
        response = await self.client.post(
            f"{self.base_url}/sites/{site_id}/deploys",
            json=payload
        )
        response.raise_for_status()
        deploy = response.json()
        
        # Upload files that need to be uploaded
        required_files = deploy.get("required", [])
        for file_sha in required_files:
            # Find the file path for this SHA
            file_path = next(
                (path for path, sha in file_hashes.items() if sha == file_sha),
                None
            )
            if file_path:
                await self._upload_file(
                    deploy["id"],
                    file_path,
                    files[file_path]
                )
        
        return deploy
    
    async def _upload_file(
        self,
        deploy_id: str,
        path: str,
        content: str
    ):
        """Upload a file to a deploy."""
        response = await self.client.put(
            f"{self.base_url}/deploys/{deploy_id}/files/{path}",
            content=content.encode(),
            headers={"Content-Type": "application/octet-stream"}
        )
        response.raise_for_status()
    
    async def get_deploy(self, deploy_id: str) -> Dict[str, Any]:
        """Get deployment status and details."""
        response = await self.client.get(f"{self.base_url}/deploys/{deploy_id}")
        response.raise_for_status()
        return response.json()
    
    async def update_site_env(
        self,
        site_id: str,
        env_vars: Dict[str, str]
    ) -> Dict[str, Any]:
        """Update site environment variables."""
        # Netlify uses build environment variables
        current_site = await self.get_site(site_id)
        build_settings = current_site.get("build_settings", {})
        
        # Merge with existing env vars
        env = build_settings.get("env", {})
        env.update(env_vars)
        
        payload = {
            "build_settings": {
                **build_settings,
                "env": env,
            }
        }
        
        response = await self.client.patch(
            f"{self.base_url}/sites/{site_id}",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
