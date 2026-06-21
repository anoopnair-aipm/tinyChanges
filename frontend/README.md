# tinyChanges — Frontend

Next.js 14 web application for the tinyChanges platform.

**Production URL**: https://tiny-changes-frontend-kfxe.vercel.app
**Deployed on**: Vercel (auto-deploys from `main`)

## Quick Start (Local Dev)

```bash
cd frontend
npm install
cp .env.example .env.local   # fill in credentials
npm run dev                   # starts on http://localhost:3000
```

See [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md) for full local setup including backend and Google OAuth.

## Scripts

```bash
npm run dev         # Start development server (hot-reload)
npm run build       # Production build
npm run start       # Serve production build locally
npm run lint        # Check code style
npm run lint:fix    # Auto-fix lint issues
npm run format      # Prettier format
npm run type-check  # TypeScript type check without building
npm run test        # Run tests
```

## Project Structure

```
app/
├── page.tsx                    # Home / landing page
├── login/                      # Parent Google OAuth login
├── login/child/                # Child Google OAuth login
├── api/auth/callback/          # OAuth callback (receives ?code= from Google)
├── dashboard/parent/           # Parent dashboard
├── dashboard/parent/child/[childId]/tasks/   # Child task view (parent)
├── dashboard/parent/child/[childId]/rewards/ # Child reward view (parent)
├── dashboard/child/            # Child dashboard
├── dashboard/child/tasks/      # Child's task list
└── dashboard/child/rewards/    # Child's reward view

components/
├── ui/             # Reusable UI primitives
├── auth/           # Login components
├── tasks/          # Task list and detail components
└── rewards/        # Reward components

lib/
├── api.ts          # Axios-based API client
├── store.ts        # Zustand global state
└── hooks/          # Custom React hooks
```

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

In production these are set in the Vercel project dashboard.

## Key Libraries

- `next` 14 — React framework with app router
- `tailwindcss` — Utility-first CSS
- `zustand` — Global client-side state
- `axios` — HTTP client for API calls

## Documentation

- [API Reference](../docs/API.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [Development Guide](../docs/DEVELOPMENT.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)
