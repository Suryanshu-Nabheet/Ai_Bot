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
