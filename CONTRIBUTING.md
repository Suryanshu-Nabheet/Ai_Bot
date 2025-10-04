# Contributing to AI Dev Platform

Thank you for your interest in contributing to AI Dev Platform! We welcome contributions from the community to help build a more powerful and accessible AI-powered development tool. This guide outlines the process for contributing, from reporting issues to submitting code changes.

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Table of Contents
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Style and Standards](#code-style-and-standards)
- [Testing](#testing)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Message Conventions](#commit-message-conventions)
- [Security Policy](#security-policy)
- [Questions and Support](#questions-and-support)

## Reporting Bugs

Before reporting a bug, please check the [existing issues](https://github.com/yourusername/ai-dev-platform/issues) to avoid duplicates.

1. Search for similar issues.
2. If none exist, create a new issue with:
   - A clear, descriptive title (e.g., "Backend: Chat endpoint fails with invalid OpenRouter key").
   - Steps to reproduce the issue.
   - Expected vs. actual behavior.
   - Environment details (OS, Node/Python versions, browser).
   - Screenshots or logs if applicable.
   - Minimal reproduction code or steps.

Label it as `bug` for triage.

## Suggesting Enhancements

We appreciate feature suggestions! To propose an enhancement:

1. Open a new issue using the "Feature request" template.
2. Describe the use case and why it's valuable.
3. Suggest an implementation approach if possible.
4. Reference any related discussions or external resources.

Enhancements are prioritized based on community interest and alignment with our roadmap.

## Development Setup

To get started with local development:

### Prerequisites
- Node.js ≥18.0.0 and npm ≥9.0.0
- Python ≥3.11
- Docker and Docker Compose (for PostgreSQL and Redis)
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
Edit `.env` with your keys (see [Environment Variables in README.md](#-environment-variables) for details). For testing, use mock values or set up test accounts for GitHub OAuth and OpenRouter.

### 4. Start Services
```bash
# Launch PostgreSQL and Redis via Docker
npm run docker:up

# Run database migrations
npm run db:migrate

# Seed initial data (optional, for testing)
npm run db:seed

# Start development servers
npm run dev
```

Access the app at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Swagger UI)

### 5. Verification
Run `npm run lint && npm run test` to ensure everything is set up correctly.

## Project Structure

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

## Code Style

- **TypeScript**: Use strict mode, prefer interfaces over types
- **Python**: Follow PEP 8, use type hints
- **Formatting**: Run `npm run format` before committing
- **Linting**: Run `npm run lint` to check for issues

## Testing

Comprehensive tests ensure reliability. Write tests for all new features and bug fixes.

- **Unit Tests**:
  - Frontend: Vitest (run `npm run test:frontend`).
  - Backend: Pytest (run `cd apps/backend && pytest`).
  - Aim for >80% coverage.

- **Integration Tests**:
  - API endpoints: Use `pytest` with `httpx` for FastAPI.
  - Database: Test with in-memory SQLite for speed.

- **E2E Tests**:
  - Frontend: Playwright (run `npm run test:e2e`).
  - Cover user flows (e.g., chat to deployment).

Run all tests:
```bash
npm run test
```

Add tests in the appropriate `tests/` directory. Use mocks for external services (e.g., OpenRouter, GitHub API).

## Pull Request Guidelines

1. **Branching**:
   - Create a feature branch from `main`: `git checkout -b feat/your-feature` or `fix/your-bug`.
   - Keep branches small and focused (one PR per feature/bug).

2. **Making Changes**:
   - Write clear, atomic commits.
   - Ensure code passes all checks (lint, test, type-check).
   - Update documentation (README, API docs) if needed.

3. **Submitting the PR**:
   - Push: `git push origin feat/your-feature`.
   - Open a PR against `main` with:
     - A descriptive title (e.g., "feat: Add Vercel deployment support").
     - Detailed description: What/Why/How.
     - Link to related issue (e.g., "Closes #123").
     - Screenshots/GIFs for UI changes.
   - Reference Conventional Commits in the title.

4. **Review Process**:
   - PRs are reviewed by maintainers.
   - Address feedback iteratively.
   - Once approved and tests pass, it will be merged.

We use squash-merge for clean history. Rebase if needed to resolve conflicts.

## Commit Message Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/) for semantic versioning and changelogs:

- `feat:` A new feature (e.g., `feat: integrate Grok-4 streaming`).
- `fix:` A bug fix (e.g., `fix: resolve OAuth callback URL mismatch`).
- `docs:` Documentation only (e.g., `docs: update deployment guide`).
- `style:` Formatting, no code changes.
- `refactor:` Code changes without new features/fixes.
- `test:` Adding/updating tests.
- `chore:` Maintenance (e.g., dependency updates).
- `ci:` CI/CD pipeline changes.
- `perf:` Performance improvements.

Scope (optional): `feat(ide): add Monaco diff viewer`.

Body: Explain "why" and "what changed". Footer: Reference issues/tickets.

Example:
```
feat(backend): add rate limiting to chat endpoint

Implement Redis-based rate limiting to prevent API abuse.
Uses 60 req/min per user.

Closes #456
```

## Security Policy

Security is a top priority. If you discover a vulnerability:

1. Do not open a public issue.
2. Report privately: security@aidevplatform.com or via GitHub's private vulnerability reporting.
3. Include reproduction steps and impact assessment.

We follow [OWASP guidelines](https://owasp.org/) and will credit responsible disclosures. See our [Security Policy](SECURITY.md) for details.

## Questions and Support

- **General Questions**: Open a [discussion](https://github.com/yourusername/ai-dev-platform/discussions).
- **Issues**: Use [GitHub Issues](https://github.com/yourusername/ai-dev-platform/issues).
- **Community**: Join our [Discord](https://discord.gg/aidevplatform) or follow [@AIDevPlatform](https://twitter.com/aidevplatform).
- **Maintainers**: Tag `@maintainer` in issues/PRs.

For sponsorship or partnerships, email contact@aidevplatform.com.

## Acknowledgments

Contributions from the open-source community make AI Dev Platform possible. See [CREDITS.md](CREDITS.md) for a full list.

Happy contributing! 🚀
