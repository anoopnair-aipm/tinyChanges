# Development Guide

## Prerequisites

- Node.js 18+ (`node --version` to check)
- Docker and Docker Compose (for local PostgreSQL)
- A Google Cloud project with OAuth 2.0 credentials

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback`
7. Copy the **Client ID** and **Client Secret** — you will need both for local env files

## Local Development Setup

### 1. Start PostgreSQL with Docker

```bash
# From the repo root
docker-compose up -d postgres
```

This starts a local PostgreSQL instance on port 5432. The backend will auto-create all tables on first run.

### 2. Backend Setup

```bash
cd backend
npm install

# Create local env file
cp .env.example .env.local
```

Edit `backend/.env.local`:
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://tinychanges:tinychanges_dev@localhost:5432/tinychanges_dev
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=any_long_random_string_for_local_dev
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`. On startup it will automatically create all database tables if they do not already exist.

### 3. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install

# Create local env file
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the frontend:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`.

## Project Structure

### Backend (`/backend`)

```
backend/
├── src/
│   ├── controllers/     # Route handlers (task, reward, auth logic)
│   ├── routes/          # Express route definitions
│   ├── middleware/      # Auth middleware (JWT verification, role checks)
│   ├── database/        # PostgreSQL connection pool and migration runner
│   ├── types/           # TypeScript interfaces and types
│   └── index.ts         # Express app setup and startup (runs migrations)
├── tests/               # Jest test suites
├── Dockerfile           # Used by Railway for production builds
├── tsconfig.json
└── package.json
```

### Frontend (`/frontend`)

```
frontend/
├── app/
│   ├── login/                          # Parent login page
│   ├── login/child/                    # Child login page
│   ├── api/auth/callback/              # OAuth callback handler
│   ├── dashboard/parent/               # Parent dashboard
│   ├── dashboard/parent/child/[childId]/tasks/    # Child task view
│   ├── dashboard/parent/child/[childId]/rewards/  # Child reward view
│   ├── dashboard/child/                # Child dashboard
│   ├── dashboard/child/tasks/          # Child task list
│   ├── dashboard/child/rewards/        # Child reward view
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Home / landing page
├── components/
│   ├── ui/              # Reusable UI primitives
│   ├── auth/            # Authentication components
│   ├── tasks/           # Task list and detail components
│   └── rewards/         # Reward components
├── lib/
│   ├── api.ts           # Axios-based API client
│   ├── store.ts         # Zustand global state
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
├── next.config.js
└── package.json
```

## Key Libraries

| Library | Used for |
|---------|----------|
| `google-auth-library` | Backend: exchanging Google OAuth auth codes for tokens |
| `jsonwebtoken` | Backend: signing and verifying JWTs |
| `pg` (node-postgres) | Backend: PostgreSQL queries with parameterized statements |
| `zustand` | Frontend: global client-side state (auth, tasks, rewards) |
| `axios` | Frontend: HTTP requests to the backend API |

## Running Tests

```bash
# Backend
cd backend
npm run test            # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## Code Style and Linting

```bash
# From either frontend/ or backend/
npm run lint            # Check for issues
npm run lint:fix        # Auto-fix issues
npm run format          # Format with Prettier
```

Run lint and format before every commit:
```bash
npm run lint:fix && npm run format
```

## Environment Variables Reference

### Backend (`backend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `development` locally |
| `PORT` | No | Defaults to `5000` |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | Yes | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Yes | From Google Cloud Console |
| `JWT_SECRET` | Yes | Any long random string locally |
| `FRONTEND_URL` | Yes | `http://localhost:3000` locally |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:5000` locally |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Yes | From Google Cloud Console |

## Debugging

### VS Code Launch Config

Add to `.vscode/launch.json` to debug the backend:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/backend",
      "envFile": "${workspaceFolder}/backend/.env.local"
    }
  ]
}
```

### Common Issues

**Database connection refused**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
PostgreSQL is not running. Start it with `docker-compose up -d postgres`.

**Port already in use**
```
Error: listen EADDRINUSE :::5000
```
Kill the existing process: `lsof -ti:5000 | xargs kill -9`

**OAuth redirect URI mismatch**
Google returns an error if the redirect URI in your request does not exactly match one of the registered URIs in Google Cloud Console. Ensure `http://localhost:3000/api/auth/callback` is listed.

**Module not found**
```
Error: Cannot find module 'express'
```
Run `npm install` inside the relevant directory (`backend/` or `frontend/`).

**Tables not created**
If the backend starts but complains about missing tables, check that `DATABASE_URL` is correct and that the backend actually connected to PostgreSQL successfully. Look for the migration log line on startup.

## Useful Commands

```bash
# Terminal 1: local PostgreSQL
docker-compose up postgres

# Terminal 2: backend (auto-creates tables, hot-reloads)
cd backend && npm run dev

# Terminal 3: frontend
cd frontend && npm run dev

# Inspect local DB
docker-compose exec postgres psql -U tinychanges -d tinychanges_dev

# Reset everything (destroys local DB data)
docker-compose down -v
```
