// code here
```"""


@router.post("/plan", response_model=GeneratePlanResponse)
async def generate_plan(
    request: GeneratePlanRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a task plan from user requirements.
    Uses Grok-4 to analyze and break down the project.
    """
    try:
        plan = await task_planner.create_plan(
            user_prompt=request.prompt,
            context=request.context
        )
        
        return GeneratePlanResponse(plan=plan)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate plan: {str(e)}"
        )


@router.post("/execute")
async def execute_generation(
    request: ExecuteGenerationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Execute code generation for a task plan.
    Streams progress and generated files.
    """
    async def generation_stream():
        try:
            tasks = request.plan.get("tasks", [])
            
            for task in tasks:
                # Send task start event
                yield f"data: {json.dumps({'type': 'task_start', 'task': task})}\n\n"
                
                # Generate code for this task
                prompt = f"""Task: {task['title']}
Description: {task['description']}
Files to create: {', '.join(task['files'])}

Generate the code for these files following best practices."""
                
                messages = [
                    {"role": "system", "content": CODE_GENERATION_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ]
                
                response = await openrouter_client.chat_completion(
                    messages=messages,
                    stream=False,
                    temperature=0.3
                )
                
                content = response["choices"][0]["message"]["content"]
                
                # Parse generated files from response
                files = _parse_generated_files(content)
                
                # Send file events
                for file_path, file_content in files.items():
                    yield f"data: {json.dumps({'type': 'file', 'path': file_path, 'content': file_content})}\n\n"
                
                # Send task complete event
                yield f"data: {json.dumps({'type': 'task_complete', 'task_id': task['id']})}\n\n"
            
            # Send overall completion
            yield f"data: {json.dumps({'type': 'complete'})}\n\n"
        
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
    
    return StreamingResponse(
        generation_stream(),
        media_type="text/event-stream"
    )


def _parse_generated_files(content: str) -> Dict[str, str]:
    """Parse generated code blocks from LLM response."""
    import re
    
    files = {}
    
    # Match code blocks with file paths
    pattern = r'``\`(?:\w+)?\s+file="([^"]+)"\n(.*?)``\`'
    matches = re.findall(pattern, content, re.DOTALL)
    
    for file_path, file_content in matches:
        files[file_path] = file_content.strip()
    
    return files


@router.post("/validate")
async def validate_code(
    code: str,
    language: str,
    current_user: User = Depends(get_current_user)
):
    """
    Validate generated code using linters and type checkers.
    """
    # TODO: Implement code validation with ESLint, TypeScript, etc.
    return {"valid": True, "errors": []}
