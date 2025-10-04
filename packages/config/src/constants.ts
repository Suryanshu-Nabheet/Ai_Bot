// Shared configuration constants

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    CALLBACK: "/api/auth/callback",
    ME: "/api/auth/me",
  },
  CHAT: {
    SEND: "/api/chat",
    STREAM: "/api/chat/stream",
    HISTORY: "/api/chat/history",
  },
  PROJECTS: {
    LIST: "/api/projects",
    CREATE: "/api/projects",
    GET: "/api/projects/:id",
    UPDATE: "/api/projects/:id",
    DELETE: "/api/projects/:id",
    FILES: "/api/projects/:id/files",
  },
  GENERATE: {
    PLAN: "/api/generate/plan",
    EXECUTE: "/api/generate/execute",
    VALIDATE: "/api/generate/validate",
  },
  GIT: {
    INIT: "/api/git/init",
    COMMIT: "/api/git/commit",
    PUSH: "/api/git/push",
    BRANCH: "/api/git/branch",
    PR: "/api/git/pr",
    MERGE: "/api/git/merge",
  },
  DEPLOY: {
    VERCEL: "/api/deploy/vercel",
    NETLIFY: "/api/deploy/netlify",
    STATUS: "/api/deploy/status",
  },
  SANDBOX: {
    EXECUTE: "/api/sandbox/execute",
    LOGS: "/api/sandbox/logs",
    STOP: "/api/sandbox/stop",
  },
} as const

export const OPENROUTER_CONFIG = {
  BASE_URL: "https://openrouter.ai/api/v1",
  MODEL: "xai/grok-beta",
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.7,
  STREAM: true,
} as const

export const RATE_LIMITS = {
  FREE_TIER: {
    REQUESTS_PER_HOUR: 50,
    TOKENS_PER_DAY: 100000,
    PROJECTS_MAX: 5,
  },
  PRO_TIER: {
    REQUESTS_PER_HOUR: 500,
    TOKENS_PER_DAY: 1000000,
    PROJECTS_MAX: 50,
  },
} as const

export const SANDBOX_LIMITS = {
  TIMEOUT_MS: 30000,
  MEMORY_MB: 512,
  CPU_CORES: 1,
  DISK_MB: 1024,
} as const

export const SUPPORTED_FRAMEWORKS = [
  { id: "nextjs", name: "Next.js", language: "typescript" },
  { id: "react", name: "React + Vite", language: "typescript" },
  { id: "vite", name: "Vite", language: "typescript" },
  { id: "nestjs", name: "NestJS", language: "typescript" },
  { id: "fastapi", name: "FastAPI", language: "python" },
] as const

export const FILE_EXTENSIONS = {
  typescript: [".ts", ".tsx"],
  javascript: [".js", ".jsx"],
  python: [".py"],
  css: [".css", ".scss", ".sass"],
  html: [".html"],
  json: [".json"],
  markdown: [".md"],
} as const
