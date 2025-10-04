# Complete Setup Guide

This guide walks you through setting up the AI Dev Platform from scratch.

## Step-by-Step Setup

### Step 1: System Requirements

Ensure you have the following installed:

- **Node.js**: Version 18 or higher
  \`\`\`bash
  node --version  # Should be v18.0.0 or higher
  \`\`\`

- **Python**: Version 3.11 or higher
  \`\`\`bash
  python --version  # Should be 3.11.0 or higher
  \`\`\`

- **Docker**: Latest version
  \`\`\`bash
  docker --version
  docker-compose --version
  \`\`\`

- **Git**: Latest version
  \`\`\`bash
  git --version
  \`\`\`

### Step 2: Clone Repository

\`\`\`bash
git clone https://github.com/yourusername/ai-dev-platform.git
cd ai-dev-platform
\`\`\`

### Step 3: Install Dependencies

\`\`\`bash
# Install Node.js dependencies
npm install

# This will install dependencies for all workspaces:
# - apps/frontend
# - apps/backend (Python via pip)
# - packages/types
# - packages/config
\`\`\`

### Step 4: Configure Environment Variables

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your favorite editor:

\`\`\`env
# OpenRouter API (Required)
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# GitHub OAuth (Required)
GITHUB_CLIENT_ID=Iv1.xxxxx
GITHUB_CLIENT_SECRET=xxxxx
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/callback/github

# Database (Auto-configured for local dev)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aidevplatform
REDIS_URL=redis://localhost:6379

# JWT Secret (Generate with: openssl rand -base64 32)
JWT_SECRET=your-secret-here
SESSION_SECRET=your-session-secret-here

# Optional: Deployment
VERCEL_TOKEN=
NETLIFY_TOKEN=
\`\`\`

### Step 5: Start Infrastructure

\`\`\`bash
# Start PostgreSQL and Redis
npm run docker:up

# Wait for services to be healthy (about 10 seconds)
# You should see:
# ✓ postgres healthy
# ✓ redis healthy
\`\`\`

### Step 6: Initialize Database

\`\`\`bash
# Run migrations
npm run db:migrate

# Seed demo data
npm run db:seed
\`\`\`

### Step 7: Start Development Servers

\`\`\`bash
# Start all services (frontend + backend)
npm run dev
\`\`\`

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Step 8: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - **Application name**: AI Dev Platform (Local Dev)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy **Client ID** and **Client Secret**
6. Update your `.env` file:
   \`\`\`env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   \`\`\`
7. Restart the backend: `npm run dev`

### Step 9: Get OpenRouter API Key

1. Visit https://openrouter.ai
2. Sign up or log in
3. Go to "Keys" section
4. Click "Create Key"
5. Copy the API key
6. Update your `.env` file:
   \`\`\`env
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   \`\`\`
7. Restart the backend

### Step 10: Test the Platform

1. Open http://localhost:3000
2. Click "Get Started"
3. Sign in with GitHub
4. You should be redirected to the dashboard
5. Click "New Project"
6. Try the chat: "Create a simple counter app with React"
7. Watch the AI generate code!

## Verification Checklist

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:8000
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] GitHub OAuth login works
- [ ] Chat interface responds to messages
- [ ] IDE loads and displays Monaco editor
- [ ] Terminal is functional
- [ ] Preview panel shows content

## Next Steps

- Read the [User Guide](./USER_GUIDE.md)
- Explore the [API Documentation](http://localhost:8000/docs)
- Check out [Example Projects](./EXAMPLES.md)
- Join our [Discord Community](https://discord.gg/aidevplatform)

## Troubleshooting

See the main [README.md](../README.md#troubleshooting) for common issues and solutions.
