# tinyChanges — Backend

Node.js/Express API server for the tinyChanges platform.

**Production URL**: https://tinychanges-api-production.up.railway.app
**Deployed on**: Railway (Docker, auto-deploys from `main`)

## Quick Start (Local Dev)

```bash
cd backend
npm install
cp .env.example .env.local   # fill in credentials
npm run dev                   # starts on http://localhost:5000
```

Database tables are created automatically on startup — no migration commands needed.

See [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md) for full local setup including PostgreSQL and Google OAuth.

## Scripts

```bash
npm run dev         # Start with ts-node-dev (hot-reload)
npm run build       # Compile TypeScript
npm run start       # Run compiled output
npm run lint        # Check code style
npm run lint:fix    # Auto-fix lint issues
npm run format      # Prettier format
npm run test        # Run Jest tests
npm run test:watch  # Watch mode
```

## Project Structure

```
src/
├── controllers/     # Route handlers
├── routes/          # API route definitions
├── middleware/      # JWT auth, role checks, error handling
├── database/        # pg connection pool and migration runner
├── types/           # TypeScript interfaces
└── index.ts         # Express server entry point (runs migrations on start)
```

## Key Libraries

- `express` — HTTP server
- `pg` — PostgreSQL client (parameterized queries)
- `google-auth-library` — Google OAuth code exchange
- `jsonwebtoken` — JWT signing and verification

## Documentation

- [API Reference](../docs/API.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [Database Schema](../docs/DATABASE.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)
