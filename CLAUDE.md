# Claude Code Configuration for tinyChanges

This document provides context and guidance for Claude Code when working on this project.

## Project Overview

**tinyChanges** is a parent-child task management platform with rewards system, designed for children aged 5-12 and their parents/guardians.

- **GitHub**: https://github.com/anoopnair-aipm/tinyChanges
- **Status**: MVP Development
- **Deployment**: Production-ready required
- **Tech Stack**: Next.js 14 (frontend), Node.js/Express (backend), PostgreSQL

## Architecture

### Frontend (Next.js 14)
- Location: `/frontend`
- Entry: `frontend/app/page.tsx`
- Key files:
  - `app/` - Pages and layouts
  - `components/` - Reusable React components
  - `lib/api.ts` - API client
  - `lib/store.ts` - Zustand state management
  - `tailwind.config.ts` - Styling configuration

### Backend (Node.js/Express)
- Location: `/backend`
- Entry: `backend/src/index.ts`
- Database: PostgreSQL
- Key files:
  - `src/index.ts` - Express server setup
  - `src/middleware/auth.ts` - Authentication middleware
  - `src/types/index.ts` - TypeScript type definitions
  - `src/database/connection.ts` - Database connection

## Key Features (MVP)

1. **Authentication**: Google OAuth for both parent and child
2. **Parent Features**:
   - Add multiple children
   - Create/edit/delete tasks with deadlines
   - Create/edit/delete custom reward list
   - Dashboard with child progress tracking
   
3. **Child Features**:
   - View assigned tasks and deadlines
   - Mark tasks as complete
   - View earned rewards
   - Redeem rewards (if completed by deadline)

## Development Setup

```bash
# Install dependencies and start everything
npm install
docker-compose up postgres
npm run dev  # Runs both frontend and backend

# Or separately:
cd backend && npm run dev     # Backend on port 5000
cd frontend && npm run dev    # Frontend on port 3000
```

## Testing

- Backend: Jest tests in `backend/tests/`
- Frontend: React Testing Library tests
- Run: `npm run test`

## Deployment

- Frontend: Vercel recommended (Next.js native)
- Backend: AWS ECS/Fargate or Docker on VPS
- Database: AWS RDS PostgreSQL or self-hosted PostgreSQL
- See `docs/DEPLOYMENT.md` for detailed instructions

## Code Style

- TypeScript strict mode enabled
- Prettier for formatting
- ESLint for linting
- Tailwind CSS for styling
- Run `npm run lint:fix && npm run format` before commits

## Git Workflow

- **Branch naming**: `feature/name`, `fix/name`, `docs/name`
- **Commit messages**: Follow format: `type(scope): description`
- **PRs**: Require tests, documentation updates, and 2 approvals
- **CI/CD**: GitHub Actions runs tests and lints on all PRs

## Important Files

- `README.md` - Project overview
- `docs/ARCHITECTURE.md` - System design
- `docs/DATABASE.md` - Schema and relationships
- `docs/API.md` - API endpoint documentation
- `docs/DEVELOPMENT.md` - Setup and troubleshooting
- `docs/DEPLOYMENT.md` - Deployment instructions
- `CONTRIBUTING.md` - Contribution guidelines

## Common Tasks

### Adding a new API endpoint
1. Create controller in `backend/src/controllers/`
2. Create route in `backend/src/routes/`
3. Add types in `backend/src/types/`
4. Write tests
5. Update `docs/API.md`

### Adding a new page
1. Create in `frontend/app/`
2. Create components in `frontend/components/`
3. Add tests
4. Test on mobile and desktop

### Database migration
```bash
cd backend
npm run db:migrate:create -- --name descriptive_name
npm run db:migrate
```

## Target Age Group

**5-12 years old** - UI must be simple, colorful, and engaging. Consider:
- Large, easy-to-click buttons
- Bright colors and fun fonts
- Simple language
- Visual feedback and animations
- No complex forms or text-heavy content

## Preferences & Standards

- Prefer monorepo structure (frontend + backend together)
- Use TypeScript strict mode
- Keep components small and reusable
- No feature flags for MVP
- Comprehensive error handling at system boundaries
- Security-first approach (OAuth, HTTPS, SQL injection prevention)

## Questions?

See `CONTRIBUTING.md` for guidelines or open a GitHub discussion.
