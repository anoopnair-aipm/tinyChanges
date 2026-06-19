# Development Guide

## Prerequisites

- Node.js 18+ (check with `node --version`)
- PostgreSQL 14+ (or Docker)
- npm or yarn package manager
- Google OAuth credentials (setup instructions below)

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback`
     - `http://localhost:3000/auth/callback`
     - `https://yourdomain.com/api/auth/callback` (production)
5. Copy Client ID and Client Secret

## Local Development Setup

### 1. Start PostgreSQL

Using Docker:
```bash
docker-compose up -d postgres
```

Or locally installed PostgreSQL:
```bash
psql -U postgres
CREATE DATABASE tinychanges_dev;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://tinychanges:tinychanges_dev@localhost:5432/tinychanges_dev
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
EOF

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
EOF

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Project Structure Details

### Backend (`/backend`)

```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── models/          # Database models/schemas
│   ├── routes/          # API route definitions
│   ├── middleware/      # Auth, validation, error handling
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types/interfaces
│   └── index.ts         # Express app setup
├── migrations/          # Database migrations
├── tests/               # Unit and integration tests
├── .env.local          # Local environment variables
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

### Frontend (`/frontend`)

```
frontend/
├── app/
│   ├── (auth)/          # Auth pages (login, callback)
│   ├── (dashboard)/     # Protected dashboard routes
│   ├── api/             # API routes (e.g., auth callbacks)
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── ui/              # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── tasks/           # Task components
│   ├── rewards/         # Reward components
│   └── layouts/         # Page layouts
├── lib/
│   ├── api.ts           # API client/fetch utilities
│   ├── auth.ts          # Authentication utilities
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
├── .env.local          # Local environment variables
├── next.config.js      # Next.js configuration
└── package.json        # Dependencies
```

## Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
npm run test           # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report

# Frontend tests
cd frontend
npm run test
npm run test:watch
```

### Code Style & Linting

```bash
# Both frontend and backend
npm run lint           # Check for issues
npm run lint:fix      # Auto-fix issues
npm run format        # Format with Prettier
```

### Database Migrations

```bash
cd backend

# Create a new migration
npm run db:migrate:create -- --name add_new_table

# Run pending migrations
npm run db:migrate

# Rollback last migration
npm run db:rollback
```

### Environment Variables

Create `.env.local` files (not committed to git):

**Backend** (`backend/.env.local`):
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
JWT_SECRET=xxx
FRONTEND_URL=http://localhost:3000
ENABLE_DEBUG_LOGGING=true
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx
```

## Debugging

### Backend Debugging

Using VS Code debugger:

1. Install extension: Debugger for Chrome
2. Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "program": "${workspaceFolder}/backend/dist/index.js",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
    }
  ]
}
```

### Frontend Debugging

Chrome DevTools are built-in. Add `debugger;` statements in code or use VS Code Debugger for Chrome.

## Common Issues & Solutions

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running and credentials are correct

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### OAuth Redirect URI Mismatch
**Solution**: Ensure registered redirect URIs in Google Cloud Console match your app URLs

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: 
```bash
npm install
rm -rf node_modules package-lock.json
npm install
```

## Performance Optimization Tips

1. **Use React DevTools Profiler** to identify slow renders
2. **Enable database query logging** to spot N+1 queries
3. **Implement API response caching** for frequently accessed data
4. **Use database indexes** on frequently queried fields
5. **Lazy load components** in frontend for better initial load

## Useful Commands

```bash
# Terminal 1: Start DB and backend
docker-compose up postgres
cd backend && npm run dev

# Terminal 2: Start frontend
cd frontend && npm run dev

# Terminal 3: Monitor logs
docker-compose logs -f postgres

# Reset everything (careful!)
docker-compose down -v
npm run db:migrate
```
