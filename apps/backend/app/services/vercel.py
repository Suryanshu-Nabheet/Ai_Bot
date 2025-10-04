"""
Vercel deployment service.
Handles project creation and deployment via Vercel API.
"""
import httpx
from typing import Dict, Any, Optional
from app.core.config import settings


class VercelService:
    """Service for Vercel API operations."""
    
    def __init__(self, token: Optional[str] = None):
        self.token = token or settings.VERCEL_TOKEN
        self.team_id = settings.VERCEL_TEAM_ID
        self.base_url = "https://api.vercel.com"
        self.client = httpx.AsyncClient(
            headers={
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json",
            },
            timeout=60.0
        )
    
    async def create_project(
        self,
        name: str,
        framework: str = "nextjs",
        git_repository: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Create a new Vercel project.
        
        Args:
            name: Project name
            framework: Framework preset (nextjs, vite, etc.)
            git_repository: Git repo config with type, repo, and branch
        
        Returns:
            Project data
        """
        payload = {
            "name": name,
            "framework": framework,
        }
        
        if git_repository:
            payload["gitRepository"] = git_repository
        
        url = f"{self.base_url}/v9/projects"
        if self.team_id:
            url += f"?teamId={self.team_id}"
        
        response = await self.client.post(url, json=payload)
        response.raise_for_status()
        return response.json()
    
    async def get_project(self, project_id: str) -> Dict[str, Any]:
        """Get project details."""
        url = f"{self.base_url}/v9/projects/{project_id}"
        if self.team_id:
            url += f"?teamId={self.team_id}"
        
        response = await self.client.get(url)
        response.raise_for_status()
        return response.json()
    
    async def create_deployment(
        self,
        project_name: str,
        files: Dict[str, str],
        target: str = "production",
        git_source: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create a new deployment.
        
        Args:
            project_name: Project name
            files: Dict of file paths to content
            target: "production" or "preview"
            git_source: Git source metadata
        
        Returns:
            Deployment data
        """
        # Prepare files for deployment
        deployment_files = []
        for path, content in files.items():
            deployment_files.append({
                "file": path,
                "data": content,
            })
        
        payload = {
            "name": project_name,
            "files": deployment_files,
            "target": target,
            "projectSettings": {
                "framework": "nextjs",
            }
        }
        
        if git_source:
            payload["gitSource"] = git_source
        
        url = f"{self.base_url}/v13/deployments"
        if self.team_id:
            url += f"?teamId={self.team_id}"
        
        response = await self.client.post(url, json=payload)
        response.raise_for_status()
        return response.json()
    
    async def get_deployment(self, deployment_id: str) -> Dict[str, Any]:
        """Get deployment status and details."""
        url = f"{self.base_url}/v13/deployments/{deployment_id}"
        if self.team_id:
            url += f"?teamId={self.team_id}"
        
        response = await self.client.get(url)
        response.raise_for_status()
        return response.json()
    
    async def get_deployment_logs(
        self,
        deployment_id: str,
        limit: int = 100
    ) -> Dict[str, Any]:
        """Get deployment build logs."""
        url = f"{self.base_url}/v2/deployments/{deployment_id}/events"
        params = {"limit": limit}
        if self.team_id:
            params["teamId"] = self.team_id
        
        response = await self.client.get(url, params=params)
        response.raise_for_status()
        return response.json()
    
    async def set_environment_variables(
        self,
        project_id: str,
        env_vars: Dict[str, str],
        target: list[str] = None
    ) -> Dict[str, Any]:
        """
        Set environment variables for a project.
        
        Args:
            project_id: Project ID
            env_vars: Dict of env var names to values
            target: List of targets (production, preview, development)
        
        Returns:
            Response data
        """
        if target is None:
            target = ["production", "preview", "development"]
        
        env_list = []
        for key, value in env_vars.items():
            env_list.append({
                "key": key,
                "value": value,
                "target": target,
                "type": "encrypted",
            })
        
        url = f"{self.base_url}/v9/projects/{project_id}/env"
        if self.team_id:
            url += f"?teamId={self.team_id}"
        
        response = await self.client.post(url, json={"env": env_list})
        response.raise_for_status()
        return response.json()
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
