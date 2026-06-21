# tinyChanges

A parent-child task management platform where parents assign tasks with rewards, and children track progress and earn achievements.

**Target Age**: 5-12 years old
**Status**: MVP complete and live in production

## Live Application

**Visit tinyChanges: https://tiny-changes-frontend-kfxe.vercel.app**

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | https://tiny-changes-frontend-kfxe.vercel.app | Live |
| Backend API | https://tinychanges-api-production.up.railway.app | Live |
| Database | PostgreSQL on Railway | Connected |

All systems operational. See [TEST_RESULTS.md](./TEST_RESULTS.md) for detailed verification results.

## Features (MVP)

### Parent Features
- Google OAuth account creation and login
- Add multiple children to your account
- Create, edit, and delete tasks with deadlines and priority levels
- Create and manage a custom reward list
- Dashboard showing child progress and task completion status

### Child Features
- Google OAuth login (separate flow from parent)
- View assigned tasks with deadlines
- Mark tasks as complete with optional notes
- View earned reward balance
- Redeem rewards

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| State Management | Zustand |
| Backend | Node.js/Express, TypeScript |
| Database | PostgreSQL (node-postgres / pg) |
| Authentication | Google OAuth 2.0, google-auth-library, JWT |
| Frontend Hosting | Vercel |
| Backend + DB Hosting | Railway |

## Project Structure

```
tinyChanges/
├── frontend/               # Next.js 14 application
│   ├── app/                # App router pages and layouts
│   ├── components/         # Reusable React components
│   ├── lib/                # API client, Zustand store, hooks
│   └── public/             # Static assets
├── backend/                # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── database/       # Database connection and migrations
│   │   └── index.ts        # Express server entry point
│   └── tests/              # Jest test suites
├── docs/                   # Architecture, API, and guides
├── docker-compose.yml      # Local PostgreSQL setup
└── README.md
```

## Screenshots

<!-- Add screenshots here once the UI is finalized. Suggested shots:
     - Landing page
     - Parent dashboard
     - Task creation form
     - Child dashboard with task list
     - Reward redemption view
-->

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- Docker (for local PostgreSQL)
- Google OAuth credentials

### Setup

```bash
# Clone the repo
git clone https://github.com/anoopnair-aipm/tinyChanges.git
cd tinyChanges

# Start local PostgreSQL
docker-compose up -d postgres

# Backend
cd backend
npm install
cp .env.example .env.local   # then fill in credentials
npm run dev                   # runs on http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local   # then fill in credentials
npm run dev                   # runs on http://localhost:3000
```

See [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) for full setup details including Google OAuth configuration.

## Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Database Schema](./docs/DATABASE.md)
- [API Documentation](./docs/API.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Test Results](./TEST_RESULTS.md)

## Authentication Flow

1. User clicks "Sign in with Google"
2. Frontend redirects to Google OAuth consent screen
3. Google redirects back to `/api/auth/callback?code=xxx`
4. Frontend sends the code to `POST /api/auth/login` (or `/api/auth/child-login`)
5. Backend uses `google-auth-library` `OAuth2Client.getToken(code)` to exchange code for tokens
6. Backend decodes the `id_token`, finds or creates the user in the database
7. Backend issues a JWT
8. Frontend stores the JWT in localStorage and redirects to the appropriate dashboard

## Security

- Google OAuth 2.0 — no passwords stored
- JWT tokens for API authorization
- Parameterized queries — SQL injection prevention
- Role-based access control (parent vs. child)
- HTTPS in production (enforced by Vercel and Railway)

## License

MIT License — see LICENSE file.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
