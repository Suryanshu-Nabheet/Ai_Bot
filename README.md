# AI Bot

> A production-grade AI-powered developer platform leveraging xAI's Grok-4 via OpenRouter. Build full-stack applications conversationally with an integrated Monaco IDE, live preview, Git integration, and seamless deployment to Vercel or Netlify.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yourusername/ai-dev-platform/blob/main/LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-yellow.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

## 🚀 Overview

AI Dev Platform is an open-source tool that empowers developers to create, edit, and deploy full-stack applications using natural language interactions with Grok-4. It combines a conversational AI interface with a robust IDE, enabling rapid prototyping and production-ready development.

Key differentiators:
- **Conversational Development**: Generate code, plans, and architectures via chat.
- **Integrated Workflow**: Seamless transition from ideation to deployment.
- **Extensible Architecture**: Modular design for custom integrations.

## ✨ Features

- **AI-Powered Code Generation**: Leverage Grok-4 for generating production-ready code, task plans, and debugging assistance.
- **Monaco IDE**: VS Code-like editor with syntax highlighting, IntelliSense, and multi-language support.
- **Live Preview**: Real-time hot reload for frontend changes with iframe-based previews.
- **Embedded Terminal**: xterm.js-powered terminal for executing commands directly in the browser.
- **Git Integration**: Full GitHub workflow support (init, commit, branch, PR, merge) with OAuth authentication.
- **One-Click Deployment**: Automated deployments to Vercel, Netlify, or custom providers.
- **Authentication & Security**: Secure GitHub/Google OAuth with JWT tokens and rate limiting.
- **Production-Grade**: Includes TypeScript, ESLint/Prettier, comprehensive tests, and CI/CD pipelines.

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Editor**: Monaco Editor (from VS Code)
- **Terminal**: xterm.js
- **State Management**: Zustand for local state + SWR for data fetching
- **Build Tool**: Turborepo for monorepo management

### Backend
- **Framework**: FastAPI (Python 3.11) with async support
- **Database**: PostgreSQL (via SQLAlchemy + Alembic)
- **Cache**: Redis for session management and rate limiting
- **AI Integration**: OpenRouter API for Grok-4 access
- **Auth**: JWT + OAuth2 (GitHub/Google)
- **HTTP Client**: httpx for async requests
- **Testing**: Pytest with coverage

### Infrastructure
- **Containerization**: Docker + Docker Compose for local dev
- **CI/CD**: GitHub Actions for linting, testing, and deployment
- **Deployment**: Vercel (frontend) + Railway/Fly.io (backend)
- **Monitoring**: Sentry for error tracking + Prometheus for metrics
- **Security**: OWASP best practices, input sanitization, and encrypted env vars

## 📋 Quick Start

### Prerequisites
- Node.js ≥18.0.0 and npm ≥9.0.0
- Python ≥3.11
- Docker and Docker Compose (for DB/Redis)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Suryanshu-Nabheet/Ai_Bot.git
cd ai-bot
```

### 2. Install Dependencies
```bash
# Install root and frontend dependencies
npm install

# Install backend dependencies
cd apps/backend && pip install -r requirements.txt && cd ../..
```

### 3. Environment Configuration
```bash
cp .env.example .env
```
Edit `.env` with your keys (see [Environment Variables](#-environment-variables) for details).

### 4. Start Services
```bash
# Launch PostgreSQL and Redis via Docker
npm run docker:up

# Run database migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed

# Start development servers
npm run dev
```

Access the app at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Swagger UI)

### 5. Setup Authentication
#### GitHub OAuth
1. Visit [GitHub Developer Settings](https://github.com/settings/developers).
2. Create a new OAuth App:
   - **Name**: AI Dev Platform
   - **Homepage URL**: http://localhost:3000
   - **Callback URL**: http://localhost:3000/api/auth/callback/github
3. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to `.env`.

#### OpenRouter API Key
1. Sign up at [OpenRouter](https://openrouter.ai).
2. Generate a key in the Keys section.
3. Set `OPENROUTER_API_KEY` in `.env`.

## 💡 Usage

### Creating a Project
1. Open http://localhost:3000 and authenticate via GitHub.
2. Click **New Project** to enter the chat interface.
3. Describe your idea: e.g., "Build a task management app with React and Supabase."
4. Approve the AI-generated plan.
5. Let Grok-4 scaffold the code.
6. Switch to the IDE for edits, preview changes, and deploy.

### Deployment Workflow
1. In the IDE, click **Deploy** in the toolbar.
2. Choose Vercel/Netlify and authorize if needed.
3. Deploy with one click—monitor progress in the UI.

For advanced usage, refer to [docs.aidevplatform.com](https://docs.aidevplatform.com).

## 📁 Project Structure

```
ai-bot
├─ .eslintrc.json
├─ .prettierrc
├─ CODE_OF_CONDUCT.md
├─ CONTRIBUTING.md
├─ README.md
├─ app
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ apps
│  ├─ backend
│  │  ├─ Dockerfile
│  │  ├─ alembic.ini
│  │  ├─ app
│  │  │  ├─ api
│  │  │  │  ├─ dependencies.py
│  │  │  │  └─ v1
│  │  │  │     ├─ auth.py
│  │  │  │     ├─ chat.py
│  │  │  │     ├─ deploy.py
│  │  │  │     ├─ generate.py
│  │  │  │     ├─ git.py
│  │  │  │     ├─ projects.py
│  │  │  │     └─ sandbox.py
│  │  │  ├─ core
│  │  │  │  ├─ config.py
│  │  │  │  ├─ database.py
│  │  │  │  ├─ redis.py
│  │  │  │  └─ security.py
│  │  │  ├─ main.py
│  │  │  ├─ middleware
│  │  │  │  ├─ logging.py
│  │  │  │  └─ rate_limit.py
│  │  │  ├─ models
│  │  │  │  └─ user.py
│  │  │  └─ services
│  │  │     ├─ github.py
│  │  │     ├─ netlify.py
│  │  │     ├─ openrouter.py
│  │  │     ├─ task_planner.py
│  │  │     └─ vercel.py
│  │  ├─ pytest.ini
│  │  ├─ requirements.txt
│  │  ├─ scripts
│  │  │  └─ seed.py
│  │  └─ tests
│  │     └─ test_openrouter.py
│  └─ frontend
│     ├─ Dockerfile
│     ├─ Dockerfile.dev
│     ├─ next.config.mjs
│     ├─ package.json
│     ├─ src
│     │  ├─ app
│     │  │  ├─ chat
│     │  │  │  └─ page.tsx
│     │  │  ├─ dashboard
│     │  │  │  └─ page.tsx
│     │  │  ├─ deploy
│     │  │  │  └─ [projectId]
│     │  │  │     └─ page.tsx
│     │  │  ├─ git
│     │  │  │  └─ [projectId]
│     │  │  │     └─ page.tsx
│     │  │  ├─ globals.css
│     │  │  ├─ ide
│     │  │  │  └─ [projectId]
│     │  │  │     └─ page.tsx
│     │  │  ├─ layout.tsx
│     │  │  ├─ login
│     │  │  │  └─ page.tsx
│     │  │  └─ page.tsx
│     │  ├─ components
│     │  │  ├─ git
│     │  │  │  └─ git-panel.tsx
│     │  │  ├─ ide
│     │  │  │  ├─ code-editor.tsx
│     │  │  │  ├─ file-tree.tsx
│     │  │  │  ├─ ide-header.tsx
│     │  │  │  ├─ preview.tsx
│     │  │  │  └─ terminal.tsx
│     │  │  ├─ providers
│     │  │  │  └─ auth-provider.tsx
│     │  │  └─ ui
│     │  │     ├─ progress.tsx
│     │  │     ├─ radio-group.tsx
│     │  │     └─ resizable.tsx
│     │  ├─ hooks
│     │  │  ├─ use-auth.ts
│     │  │  └─ use-projects.ts
│     │  └─ lib
│     │     ├─ api.ts
│     │     └─ utils.ts
│     └─ tsconfig.json
├─ components
│  ├─ theme-provider.tsx
│  └─ ui
│     ├─ accordion.tsx
│     ├─ alert-dialog.tsx
│     ├─ alert.tsx
│     ├─ aspect-ratio.tsx
│     ├─ avatar.tsx
│     ├─ badge.tsx
│     ├─ breadcrumb.tsx
│     ├─ button-group.tsx
│     ├─ button.tsx
│     ├─ calendar.tsx
│     ├─ card.tsx
│     ├─ carousel.tsx
│     ├─ chart.tsx
│     ├─ checkbox.tsx
│     ├─ collapsible.tsx
│     ├─ command.tsx
│     ├─ context-menu.tsx
│     ├─ dialog.tsx
│     ├─ drawer.tsx
│     ├─ dropdown-menu.tsx
│     ├─ empty.tsx
│     ├─ field.tsx
│     ├─ form.tsx
│     ├─ hover-card.tsx
│     ├─ input-group.tsx
│     ├─ input-otp.tsx
│     ├─ input.tsx
│     ├─ item.tsx
│     ├─ kbd.tsx
│     ├─ label.tsx
│     ├─ menubar.tsx
│     ├─ navigation-menu.tsx
│     ├─ pagination.tsx
│     ├─ popover.tsx
│     ├─ progress.tsx
│     ├─ radio-group.tsx
│     ├─ resizable.tsx
│     ├─ scroll-area.tsx
│     ├─ select.tsx
│     ├─ separator.tsx
│     ├─ sheet.tsx
│     ├─ sidebar.tsx
│     ├─ skeleton.tsx
│     ├─ slider.tsx
│     ├─ sonner.tsx
│     ├─ spinner.tsx
│     ├─ switch.tsx
│     ├─ table.tsx
│     ├─ tabs.tsx
│     ├─ textarea.tsx
│     ├─ toast.tsx
│     ├─ toaster.tsx
│     ├─ toggle-group.tsx
│     ├─ toggle.tsx
│     ├─ tooltip.tsx
│     ├─ use-mobile.tsx
│     └─ use-toast.ts
├─ components.json
├─ docker-compose.yml
├─ docs
│  └─ SETUP_GUIDE.md
├─ hooks
│  ├─ use-mobile.ts
│  └─ use-toast.ts
├─ lib
│  └─ utils.ts
├─ next.config.mjs
├─ package.json
├─ packages
│  ├─ config
│  │  ├─ package.json
│  │  ├─ src
│  │  │  └─ constants.ts
│  │  └─ tsconfig.json
│  └─ types
│     ├─ package.json
│     ├─ src
│     │  └─ index.ts
│     └─ tsconfig.json
├─ path
│  └─ to
│     └─ file.tsx
├─ pnpm-lock.yaml
├─ postcss.config.mjs
├─ public
│  ├─ placeholder-logo.png
│  ├─ placeholder-logo.svg
│  ├─ placeholder-user.jpg
│  ├─ placeholder.jpg
│  └─ placeholder.svg
├─ scripts
│  └─ demo.js
├─ styles
│  └─ globals.css
├─ tsconfig.json
└─ turbo.json

```

## 🧪 Development

### Running Tests
```bash
# All tests (frontend + backend)
npm run test

# Frontend only (Vitest)
npm run test:frontend

# Backend only (Pytest)
cd apps/backend && pytest -v
```

### Linting & Formatting
```bash
# Lint (ESLint + Ruff)
npm run lint

# Format (Prettier + Black)
npm run format

# Type check
npm run type-check
```

### Database Management
```bash
# New migration
cd apps/backend && alembic revision --autogenerate -m "Add user projects"

# Apply migrations
npm run db:migrate

# Rollback
cd apps/backend && alembic downgrade -1
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm i -g vercel
cd apps/frontend
vercel --prod
```

### Backend (Railway)
```bash
npm i -g @railway/cli
railway login
cd apps/backend
railway up
```

For production, update env vars on the hosting platform and set up custom domains.

## 🔑 Environment Variables

| Variable              | Description                          | Required |
|-----------------------|--------------------------------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key for Grok-4       | Yes     |
| `GITHUB_CLIENT_ID`   | GitHub OAuth Client ID              | Yes     |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret        | Yes     |
| `DATABASE_URL`       | PostgreSQL connection string        | Yes     |
| `REDIS_URL`          | Redis connection string             | Yes     |
| `JWT_SECRET`         | Secret for JWT signing              | Yes     |
| `VERCEL_TOKEN`       | Vercel API token (optional)         | No      |
| `NETLIFY_TOKEN`      | Netlify API token (optional)        | No      |

Generate `JWT_SECRET` with: `openssl rand -hex 32`.

## 📚 API Documentation

Explore endpoints at http://localhost:8000/docs.

### Example: Chat with Grok-4
```python
# apps/backend/app/api/chat.py (simplified)
import httpx
from fastapi import APIRouter

router = APIRouter()

@router.post("/chat")
async def chat_completion(request: ChatRequest):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "HTTP-Referer": settings.ALLOWED_HOSTS[0],
                "X-Title": settings.APP_NAME,
            },
            json={
                "model": "xai/grok-beta",
                "messages": request.messages,
                "stream": request.stream,
                "temperature": 0.7,
            },
        )
    return response.json()
```

Key endpoints:
- `POST /api/v1/chat` - Non-streaming chat
- `POST /api/v1/chat/stream` - Streaming responses
- `POST /api/v1/projects/generate` - AI project scaffolding
- `POST /api/v1/git/{action}` - Git operations
- `POST /api/v1/deploy/{provider}` - Deployment triggers

## 🔒 Security

- **Input Sanitization**: All prompts validated and escaped before LLM submission.
- **API Key Isolation**: Keys stored securely; never exposed in responses/logs.
- **Rate Limiting**: Redis-based limits (e.g., 60 req/min per user).
- **Auth**: HttpOnly cookies for JWT; CSRF protection.
- **Code Execution**: Sandboxed via Docker with CPU/memory limits.
- **Compliance**: Follows OWASP Top 10; regular audits encouraged.

Report vulnerabilities privately: security@aidevplatform.com.

## 🤝 Contributing

We ❤️ contributions! Review [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repo and create a feature branch: `git checkout -b feat/your-feature`.
2. Commit changes: `git commit -m "feat: add your feature"`.
3. Push: `git push origin feat/your-feature`.
4. Open a PR with a clear description.

Adopt [Conventional Commits](https://www.conventionalcommits.org/).

## 📄 License

MIT License - see [LICENSE](LICENSE) for full terms.

## 🙌 Acknowledgments

- [xAI](https://x.ai/) for Grok-4
- [OpenRouter](https://openrouter.ai/) for model access
- [Vercel](https://vercel.com/) & [Railway](https://railway.app/) for deployment
- [shadcn/ui](https://ui.shadcn.com/) for accessible components
- Community contributors (see [CREDITS.md](CREDITS.md))

## 🆘 Support

- **Docs**: [docs.aidevplatform.com](https://docs.aidevplatform.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-dev-platform/issues)
- **Discord**: [Join Community](https://discord.gg/aidevplatform)
- **Twitter**: [@AIDevPlatform](https://twitter.com/aidevplatform)

Built with ❤️ by the AI Dev Platform team using Next.js, FastAPI, and Grok-4.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection failed | Ensure Docker is running: `npm run docker:up`. Check `DATABASE_URL`. |
| Invalid OpenRouter key | Verify `OPENROUTER_API_KEY` in `.env`; test via curl. |
| OAuth callback error | Confirm GitHub app callback: `http://localhost:3000/api/auth/callback/github`. |
| Port conflict (3000/8000) | `lsof -ti:3000 | xargs kill -9` (macOS). |

For persistent issues, provide logs when filing an issue.

