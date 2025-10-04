"""
Task Planner service that breaks down user requests into actionable tasks.
Uses Grok-4 to analyze requirements and create structured generation plans.
"""
from typing import List, Dict, Any
from app.services.openrouter import openrouter_client


TASK_PLANNER_SYSTEM_PROMPT = """You are an expert software architect and task planner.
Your job is to analyze user requirements and break them down into specific, actionable tasks.

For each project request, create a structured plan with:
1. Project metadata (name, description, framework, language)
2. List of tasks with:
   - Title: Clear, concise task name
   - Description: What needs to be built
   - Type: component, api, schema, config, or test
   - Files: List of file paths to create/modify
   - Dependencies: Task IDs this depends on

Output ONLY valid JSON in this exact format:
{
  "project": {
    "name": "project-name",
    "description": "Brief description",
    "framework": "nextjs|react|vite|nestjs|fastapi",
    "language": "typescript|javascript|python"
  },
  "tasks": [
    {
      "id": "task-1",
      "title": "Task title",
      "description": "What to build",
      "type": "component|api|schema|config|test",
      "files": ["path/to/file.tsx"],
      "dependencies": []
    }
  ]
}

Be specific about file paths and follow framework conventions.
Keep tasks focused and atomic - each should produce 1-3 files.
"""


class TaskPlanner:
    """Service for breaking down project requirements into tasks."""
    
    async def create_plan(self, user_prompt: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Create a task plan from user requirements.
        
        Args:
            user_prompt: User's project description
            context: Optional context (existing project, preferences)
        
        Returns:
            Structured task plan with project metadata and tasks
        """
        # Build context-aware prompt
        full_prompt = self._build_prompt(user_prompt, context)
        
        # Call Grok-4 for planning
        messages = [
            {"role": "system", "content": TASK_PLANNER_SYSTEM_PROMPT},
            {"role": "user", "content": full_prompt}
        ]
        
        response = await openrouter_client.chat_completion(
            messages=messages,
            temperature=0.3,  # Lower temperature for more consistent planning
            max_tokens=2048
        )
        
        # Parse response
        content = response["choices"][0]["message"]["content"]
        
        try:
            import json
            plan = json.loads(content)
            return self._validate_plan(plan)
        except json.JSONDecodeError as e:
            # Fallback: extract JSON from markdown code blocks
            import re
            json_match = re.search(r'```json\n(.*?)\n```', content, re.DOTALL)
            if json_match:
                plan = json.loads(json_match.group(1))
                return self._validate_plan(plan)
            raise ValueError(f"Failed to parse task plan: {e}")
    
    def _build_prompt(self, user_prompt: str, context: Optional[Dict] = None) -> str:
        """Build a detailed prompt with context."""
        prompt_parts = [f"User request: {user_prompt}"]
        
        if context:
            if "framework" in context:
                prompt_parts.append(f"Preferred framework: {context['framework']}")
            if "language" in context:
                prompt_parts.append(f"Preferred language: {context['language']}")
            if "features" in context:
                prompt_parts.append(f"Required features: {', '.join(context['features'])}")
        
        prompt_parts.append("\nCreate a detailed task plan for this project.")
        
        return "\n".join(prompt_parts)
    
    def _validate_plan(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and normalize the task plan."""
        # Ensure required fields exist
        if "project" not in plan:
            raise ValueError("Plan missing 'project' field")
        if "tasks" not in plan:
            raise ValueError("Plan missing 'tasks' field")
        
        # Validate project metadata
        project = plan["project"]
        required_project_fields = ["name", "description", "framework", "language"]
        for field in required_project_fields:
            if field not in project:
                raise ValueError(f"Project missing required field: {field}")
        
        # Validate tasks
        for i, task in enumerate(plan["tasks"]):
            if "id" not in task:
                task["id"] = f"task-{i+1}"
            if "title" not in task:
                raise ValueError(f"Task {task['id']} missing 'title'")
            if "type" not in task:
                task["type"] = "component"
            if "files" not in task:
                task["files"] = []
            if "dependencies" not in task:
                task["dependencies"] = []
        
        return plan


# Global task planner instance
task_planner = TaskPlanner()
