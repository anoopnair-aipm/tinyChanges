# Architecture Overview

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel                                   │
│                                                                  │
│   Next.js 14 Frontend                                           │
│   https://tiny-changes-frontend-kfxe.vercel.app                │
│   - Auto-deploys from main branch                               │
│   - Handles SSR, static pages, and /api/auth/callback           │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ HTTPS REST API
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                         Railway                                  │
│                                                                  │
│   Node.js/Express Backend (Docker)                              │
│   https://tinychanges-api-production.up.railway.app            │
│   - Auto-deploys from main branch                               │
│   - Runs DB migrations on startup                               │
│                                                                  │
│   PostgreSQL (Railway managed)                                  │
│   - Connected via DATABASE_URL env var                          │
│   - Persisted Railway volume                                    │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ OAuth token exchange
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                      Google OAuth 2.0                            │
│   - Issues authorization codes to the frontend                  │
│   - Backend exchanges codes for tokens via google-auth-library  │
└─────────────────────────────────────────────────────────────────┘
```

## System Components

### Frontend (Vercel / Next.js 14)

- App router with TypeScript
- Tailwind CSS for styling
- Zustand for client-side state management
- Axios for HTTP calls to the backend API
- Handles the OAuth callback (`/api/auth/callback`) — receives `?code=` from Google and forwards it to the backend

### Backend (Railway / Node.js + Express)

- TypeScript, compiled at build time
- PostgreSQL via `pg` (node-postgres) with a connection pool
- `google-auth-library` `OAuth2Client.getToken(code)` for exchanging Google auth codes
- `jsonwebtoken` for issuing and verifying JWTs
- Database migrations run automatically at server startup (`src/index.ts` calls the migration runner before the Express app starts listening)
- Deployed as a Docker container; Railway builds and runs it automatically on push to `main`

### Database (Railway PostgreSQL)

- Managed PostgreSQL instance on Railway
- Schema is created and kept up to date by the backend's auto-migration system
- No manual migration commands needed in production

## Google OAuth Flow

```
1. User visits /login (or /login/child) on the frontend

2. Frontend redirects to Google OAuth consent screen
   https://accounts.google.com/o/oauth2/v2/auth?...
   &redirect_uri=https://tiny-changes-frontend-kfxe.vercel.app/api/auth/callback

3. Google authenticates the user and redirects to:
   https://tiny-changes-frontend-kfxe.vercel.app/api/auth/callback?code=AUTH_CODE

4. Frontend /api/auth/callback route sends the code to:
   POST https://tinychanges-api-production.up.railway.app/api/auth/login
   Body: { "code": "AUTH_CODE" }

5. Backend calls google-auth-library:
   const { tokens } = await oauth2Client.getToken(code)
   Decodes tokens.id_token to get user's Google ID, email, name

6. Backend finds or creates user record in PostgreSQL

7. Backend signs and returns a JWT

8. Frontend stores JWT in localStorage
   Redirects to /dashboard/parent or /dashboard/child
```

## Task Completion Flow

```
1. Child views task in /dashboard/child/tasks

2. Clicks "Mark as Complete"

3. Frontend sends:
   POST /api/tasks/:taskId/complete
   Authorization: Bearer <child_jwt>
   Body: { "notes": "optional notes" }

4. Backend verifies:
   - JWT is valid and belongs to a child
   - Task is assigned to this child
   - Task status is "pending"

5. Backend creates a task_completion record

6. If task has a linked reward:
   - Increments child's reward_balance for that reward

7. Returns { taskId, completedAt, rewardEarned }

8. Frontend updates UI to show task as complete
```

## Database Relationship Model

```
users (parent)
├── users (children, via parent_id FK)
│   ├── tasks (child_id FK)
│   │   └── task_completions (task_id FK)
│   ├── reward_balances (child_id FK)
│   └── reward_redemptions (child_id FK)
└── rewards (parent_id FK)
    └── tasks (reward_id FK, optional)
```

## Auto-Migration System

The backend does not use Knex, TypeORM, or any migration framework. Instead, `src/index.ts` runs the schema SQL directly against the database on every startup using `IF NOT EXISTS` guards. This means:

- The schema is always applied on first boot or if tables are missing
- No migration commands need to be run manually in production
- Railway's environment provides `DATABASE_URL` which the backend uses for the connection pool

## Security Layers

1. **Transport**: HTTPS enforced by Vercel and Railway
2. **Authentication**: Google OAuth 2.0 — no passwords stored
3. **Authorization**: JWT middleware on all protected routes; role checked (parent vs. child) per endpoint
4. **Database**: Parameterized queries via `pg` — no raw string interpolation
5. **CORS**: Backend only accepts requests from the configured `FRONTEND_URL`
6. **Secrets**: All credentials are environment variables, never in source code

## Scalability Notes (current MVP baseline)

- Backend is stateless — can scale horizontally on Railway if needed
- PostgreSQL connection pool configured to handle concurrent requests
- Frontend is statically optimized by Vercel's CDN
- No Redis/caching layer currently — can be added for read-heavy paths in a future iteration
