# Contributing to AI Dev Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Prerequisites**
   - Node.js 18+ and npm 9+
   - Docker and Docker Compose
   - Python 3.11+
   - Git

2. **Clone and Install**
   \`\`\`bash
   git clone https://github.com/yourusername/ai-dev-platform.git
   cd ai-dev-platform
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your API keys
   \`\`\`

4. **Start Services**
   \`\`\`bash
   npm run docker:up
   npm run db:migrate
   npm run dev
   \`\`\`

## Project Structure

\`\`\`
ai-dev-platform/
├── apps/
│   ├── frontend/          # Next.js frontend
│   └── backend/           # FastAPI backend
├── packages/
│   ├── types/             # Shared TypeScript types
│   └── config/            # Shared configuration
├── scripts/               # Utility scripts
└── docker-compose.yml     # Local development services
\`\`\`

## Code Style

- **TypeScript**: Use strict mode, prefer interfaces over types
- **Python**: Follow PEP 8, use type hints
- **Formatting**: Run `npm run format` before committing
- **Linting**: Run `npm run lint` to check for issues

## Testing

- **Unit Tests**: `npm run test`
- **E2E Tests**: `npm run test:e2e`
- Write tests for new features and bug fixes

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes with clear, atomic commits
3. Add tests for new functionality
4. Update documentation as needed
5. Run linters and tests: `npm run lint && npm run test`
6. Push and create a PR with a clear description

## Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions or changes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

## Questions?

Open an issue or reach out to the maintainers.
