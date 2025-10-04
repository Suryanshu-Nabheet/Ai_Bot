"""
GitHub integration service using Octokit-style API calls.
Handles repository operations, commits, branches, PRs, and merges.
"""
import httpx
from typing import Dict, Any, List, Optional
from app.core.config import settings


class GitHubService:
    """Service for GitHub API operations."""
    
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = "https://api.github.com"
        self.client = httpx.AsyncClient(
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
            timeout=30.0
        )
    
    async def get_user(self) -> Dict[str, Any]:
        """Get authenticated user information."""
        response = await self.client.get(f"{self.base_url}/user")
        response.raise_for_status()
        return response.json()
    
    async def create_repository(
        self,
        name: str,
        description: str = "",
        private: bool = True,
        auto_init: bool = False
    ) -> Dict[str, Any]:
        """
        Create a new GitHub repository.
        
        Args:
            name: Repository name
            description: Repository description
            private: Whether the repo should be private
            auto_init: Initialize with README
        
        Returns:
            Repository data
        """
        payload = {
            "name": name,
            "description": description,
            "private": private,
            "auto_init": auto_init,
        }
        
        response = await self.client.post(
            f"{self.base_url}/user/repos",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    async def get_repository(self, owner: str, repo: str) -> Dict[str, Any]:
        """Get repository information."""
        response = await self.client.get(f"{self.base_url}/repos/{owner}/{repo}")
        response.raise_for_status()
        return response.json()
    
    async def create_or_update_file(
        self,
        owner: str,
        repo: str,
        path: str,
        content: str,
        message: str,
        branch: str = "main",
        sha: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create or update a file in the repository.
        
        Args:
            owner: Repository owner
            repo: Repository name
            path: File path
            content: File content (will be base64 encoded)
            message: Commit message
            branch: Branch name
            sha: File SHA (required for updates)
        
        Returns:
            Commit data
        """
        import base64
        
        encoded_content = base64.b64encode(content.encode()).decode()
        
        payload = {
            "message": message,
            "content": encoded_content,
            "branch": branch,
        }
        
        if sha:
            payload["sha"] = sha
        
        response = await self.client.put(
            f"{self.base_url}/repos/{owner}/{repo}/contents/{path}",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    async def create_tree(
        self,
        owner: str,
        repo: str,
        files: Dict[str, str],
        base_tree: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a Git tree with multiple files.
        
        Args:
            owner: Repository owner
            repo: Repository name
            files: Dict of file paths to content
            base_tree: Base tree SHA
        
        Returns:
            Tree data
        """
        import base64
        
        tree = []
        for path, content in files.items():
            tree.append({
                "path": path,
                "mode": "100644",
                "type": "blob",
                "content": content,
            })
        
        payload = {"tree": tree}
        if base_tree:
            payload["base_tree"] = base_tree
        
        response = await self.client.post(
            f"{self.base_url}/repos/{owner}/{repo}/git/trees",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    async def create_commit(
        self,
        owner: str,
        repo: str,
        message: str,
        tree: str,
        parents: List[str]
    ) -> Dict[str, Any]:
        """Create a Git commit."""
        payload = {
            "message": message,
            "tree": tree,
            "parents": parents,
        }
        
        response = await self.client.post(
            f"{self.base_url}/repos/{owner}/{repo}/git/commits",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    async def update_reference(
        self,
        owner: str,
        repo: str,
        ref: str,
        sha: str,
        force: bool = False
    ) -> Dict[str, Any]:
        """Update a Git reference (branch)."""
        payload = {
            "sha": sha,
            "force": force,
        }
        
        response = await self.client.patch(
            f"{self.base_url}/repos/{owner}/{repo}/git/refs/{ref}",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    async def create_branch(
        self,
        owner: str,
        repo: str,
        branch: str,
        from_branch: str = "main"
    ) -> Dict[str, Any]:
        """Create a new branch."""
        # Get the SHA of the source branch
        ref_response = await self.client.get(
            f"{self.base_url}/repos/{owner}/{repo}/git/ref/heads/{from_branch}"
        )
        ref_response.raise_for_status()
        sha = ref_response.json()["object"]["sha"]
        
        # Create new branch
        payload = {
            "ref": f"refs/heads/{branch}",
            "sha": sha,
        }
        
        response = await self.client.post(
            f"{self.base_url}/repos/{owner}/{repo}/git/refs",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    async def create_pull_request(
        self,
        owner: str,
        repo: str,
        title: str,
        head: str,
        base: str = "main",
        body: str = ""
    ) -> Dict[str, Any]:
        """Create a pull request."""
        payload = {
            "title": title,
            "head": head,
            "base": base,
            "body": body,
        }
        
        response = await self.client.post(
            f"{self.base_url}/repos/{owner}/{repo}/pulls",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    async def merge_pull_request(
        self,
        owner: str,
        repo: str,
        pull_number: int,
        commit_title: Optional[str] = None,
        merge_method: str = "merge"
    ) -> Dict[str, Any]:
        """
        Merge a pull request.
        
        Args:
            owner: Repository owner
            repo: Repository name
            pull_number: PR number
            commit_title: Merge commit title
            merge_method: "merge", "squash", or "rebase"
        
        Returns:
            Merge data
        """
        payload = {"merge_method": merge_method}
        if commit_title:
            payload["commit_title"] = commit_title
        
        response = await self.client.put(
            f"{self.base_url}/repos/{owner}/{repo}/pulls/{pull_number}/merge",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    async def get_commits(
        self,
        owner: str,
        repo: str,
        branch: Optional[str] = None,
        per_page: int = 30
    ) -> List[Dict[str, Any]]:
        """Get commit history."""
        params = {"per_page": per_page}
        if branch:
            params["sha"] = branch
        
        response = await self.client.get(
            f"{self.base_url}/repos/{owner}/{repo}/commits",
            params=params
        )
        response.raise_for_status()
        return response.json()
    
    async def get_commit_diff(
        self,
        owner: str,
        repo: str,
        commit_sha: str
    ) -> Dict[str, Any]:
        """Get commit diff."""
        response = await self.client.get(
            f"{self.base_url}/repos/{owner}/{repo}/commits/{commit_sha}",
            headers={"Accept": "application/vnd.github.diff"}
        )
        response.raise_for_status()
        return {"diff": response.text}
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
