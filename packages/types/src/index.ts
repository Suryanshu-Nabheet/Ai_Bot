// Shared TypeScript types across frontend and backend

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  githubId?: string
  googleId?: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  userId: string
  name: string
  description: string
  framework: "nextjs" | "react" | "vite" | "nestjs" | "fastapi"
  language: "typescript" | "javascript" | "python"
  status: "creating" | "ready" | "building" | "deploying" | "deployed" | "error"
  githubRepo?: string
  deployUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectFile {
  id: string
  projectId: string
  path: string
  content: string
  language: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  projectId?: string
  userId: string
  role: "user" | "assistant" | "system"
  content: string
  metadata?: Record<string, any>
  createdAt: string
}

export interface TaskPlan {
  id: string
  projectId: string
  tasks: Task[]
  status: "pending" | "approved" | "generating" | "completed" | "failed"
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  type: "component" | "api" | "schema" | "config" | "test"
  status: "pending" | "generating" | "completed" | "failed"
  files: string[]
  dependencies: string[]
}

export interface DeploymentConfig {
  provider: "vercel" | "netlify"
  projectId: string
  buildCommand?: string
  outputDirectory?: string
  environmentVariables?: Record<string, string>
}

export interface GitOperation {
  type: "init" | "commit" | "push" | "branch" | "pr" | "merge"
  projectId: string
  data: Record<string, any>
}

export interface UsageMetrics {
  userId: string
  projectsCreated: number
  tokensUsed: number
  deploymentsCount: number
  lastActive: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface StreamEvent {
  type: "token" | "task" | "file" | "error" | "complete"
  data: any
}
