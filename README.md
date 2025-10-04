# AI Dev Platform

> Production-grade AI developer platform powered by xAI Grok-4 via OpenRouter. Build full-stack applications through conversational AI with an integrated Monaco IDE, live preview, Git integration, and one-click deployment to Vercel/Netlify.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)

## Features

- **AI-Powered Code Generation**: Chat with Grok-4 to generate production-ready code
- **Monaco IDE**: Full-featured code editor with syntax highlighting and IntelliSense
- **Live Preview**: See your changes instantly with hot reload
- **Terminal**: Embedded xterm.js terminal for running commands
- **Git Integration**: Full GitHub integration (init, commit, push, PR, merge)
- **One-Click Deploy**: Deploy to Vercel or Netlify with a single click
- **Authentication**: GitHub OAuth + Google OAuth
- **Production Ready**: TypeScript, linting, tests, CI/CD included

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Code Editor**: Monaco Editor
- **Terminal**: xterm.js
- **State Management**: Zustand + SWR

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **Cache**: Redis
- **AI**: OpenRouter API (Grok-4)
- **Authentication**: JWT + OAuth
- **API Client**: httpx (async)

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (frontend) + Railway/Fly.io (backend)
- **Monitoring**: Sentry + Prometheus

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Python 3.11+
- Docker and Docker Compose
- Git

### 1. Clone and Install

\`\`\`bash
git clone https://github.com/yourusername/ai-dev-platform.git
cd ai-dev-platform
npm install
\`\`\`

### 2. Environment Setup

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your API keys:

\`\`\`env
# Required
OPENROUTER_API_KEY=your_openrouter_api_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aidevplatform
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here

# Optional
VERCEL_TOKEN=your_vercel_token
NETLIFY_TOKEN=your_netlify_token
\`\`\`

### 3. Start Services

\`\`\`bash
# Start PostgreSQL and Redis
npm run docker:up

# Run database migrations
npm run db:migrate

# Seed demo data
npm run db:seed

# Start development servers
npm run dev
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 4. Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: AI Dev Platform (Local)
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
4. Copy the Client ID and Client Secret to your `.env` file

### 5. Get OpenRouter API Key

1. Sign up at https://openrouter.ai
2. Go to Keys section
3. Create a new API key
4. Add it to your `.env` file as `OPENROUTER_API_KEY`

## Usage

### Create a Project via Chat

1. Navigate to http://localhost:3000
2. Click "Get Started" and sign in with GitHub
3. Click "New Project" to open the chat interface
4. Describe your project: "Create a blog with Next.js and TypeScript"
5. Review the generated task plan and approve
6. Watch as the AI generates your code
7. Open the IDE to edit and preview your project

### Deploy to Vercel

1. Open your project in the IDE
2. Click the "Deploy" button in the header
3. Select "Vercel" as the provider
4. Click "Deploy to Vercel"
5. Wait for deployment to complete
6. Visit your live URL

## Project Structure

\`\`\`
ai-dev-platform/
├── apps/
│   ├── frontend/              # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/          # App router pages
│   │   │   ├── components/   # React components
│   │   │   ├── hooks/        # Custom hooks
│   │   │   └── lib/          # Utilities
│   │   └── package.json
│   └── backend/              # FastAPI backend
│       ├── app/
│       │   ├── api/          # API routes
│       │   ├── core/         # Core config
│       │   ├── models/       # Database models
│       │   ├── services/     # Business logic
│       │   └── middleware/   # Middleware
│       ├── tests/            # Tests
│       └── requirements.txt
├── packages/
│   ├── types/                # Shared TypeScript types
│   └── config/               # Shared configuration
├── scripts/                  # Utility scripts
├── .github/
│   └── workflows/            # CI/CD workflows
├── docker-compose.yml        # Local development
├── turbo.json               # Turborepo config
└── package.json             # Root package.json
\`\`\`

## Development

### Run Tests

\`\`\`bash
# Run all tests
npm run test

# Frontend tests only
npm run test --workspace=apps/frontend

# Backend tests only
cd apps/backend && pytest
\`\`\`

### Linting and Formatting

\`\`\`bash
# Lint all code
npm run lint

# Format all code
npm run format
\`\`\`

### Database Migrations

\`\`\`bash
# Create a new migration
cd apps/backend
alembic revision --autogenerate -m "description"

# Run migrations
npm run db:migrate

# Rollback migration
cd apps/backend
alembic downgrade -1
\`\`\`

## Deployment

### Deploy Frontend to Vercel

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/frontend
vercel --prod
\`\`\`

### Deploy Backend to Railway

\`\`\`bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
\`\`\`

## API Documentation

### OpenRouter Integration

The platform uses OpenRouter to access Grok-4. Example request:

\`\`\`python
import httpx

async def chat_with_grok():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "xai/grok-beta",
                "messages": [
                    {"role": "user", "content": "Create a React component"}
                ],
                "stream": True,
            }
        )
        return response
\`\`\`

### Key Endpoints

- `POST /api/chat` - Send chat message
- `POST /api/chat/stream` - Stream chat response
- `POST /api/generate/plan` - Generate task plan
- `POST /api/generate/execute` - Execute code generation
- `POST /api/git/init` - Initialize GitHub repo
- `POST /api/deploy/vercel` - Deploy to Vercel

Full API documentation: http://localhost:8000/docs

## Security

- All user prompts are sanitized before sending to LLM
- API keys are never logged or exposed
- Rate limiting per user (Redis-backed)
- JWT tokens with HttpOnly cookies
- Sandboxed code execution with resource limits
- Environment variables encrypted at rest

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [xAI](https://x.ai) for Grok-4
- [OpenRouter](https://openrouter.ai) for API access
- [Vercel](https://vercel.com) for hosting
- [shadcn/ui](https://ui.shadcn.com) for UI components

## Support

- Documentation: [docs.aidevplatform.com](https://docs.aidevplatform.com)
- Issues: [GitHub Issues](https://github.com/yourusername/ai-dev-platform/issues)
- Discord: [Join our community](https://discord.gg/aidevplatform)

---

Built with ❤️ using Next.js, FastAPI, and Grok-4
\`\`\`

## Troubleshooting

### Common Issues

**Issue**: "Failed to connect to database"
- **Solution**: Make sure PostgreSQL is running: `docker-compose up postgres`

**Issue**: "OpenRouter API key invalid"
- **Solution**: Check your `.env` file and ensure `OPENROUTER_API_KEY` is set correctly

**Issue**: "GitHub OAuth callback failed"
- **Solution**: Verify your GitHub OAuth app callback URL matches `http://localhost:3000/api/auth/callback/github`

**Issue**: "Port 3000 already in use"
- **Solution**: Kill the process using port 3000: `lsof -ti:3000 | xargs kill -9`

For more help, open an issue on GitHub.
