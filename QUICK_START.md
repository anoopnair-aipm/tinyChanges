# Quick Start Guide 🚀

Get tinyChanges running locally in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL (or Docker)
- Google OAuth credentials

## Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback`
   - `http://localhost:3000/auth/callback`
7. Copy your **Client ID** and **Client Secret**

## Step 2: Set Up Environment Variables

**Backend** (`backend/.env.local`):
```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://tinychanges:tinychanges_dev@localhost:5432/tinychanges_dev
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
JWT_SECRET=your_super_secret_jwt_key_12345
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
```

## Step 3: Start PostgreSQL

Using Docker:
```bash
docker-compose up -d postgres
```

Or if you have PostgreSQL installed locally:
```bash
createdb tinychanges_dev
```

## Step 4: Install Dependencies & Run Migrations

```bash
npm install
cd backend
npm run db:init
```

## Step 5: Start Development Servers

**Option A: Start both together**
```bash
npm run dev
```

**Option B: Start separately**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

## Step 6: Test It Out! 🎉

1. Open **http://localhost:3000**
2. Click **"Get Started"** → **"Sign in with Google"**
3. Log in with your Google account
4. You're now a parent! ✅
5. Add a child by filling in the form on the dashboard
6. Visit **http://localhost:3000/login/child** to test child login

## What Works Now

✅ Parent Google OAuth login  
✅ Child account creation by parent  
✅ Child Google OAuth login  
✅ Protected dashboard routes  
✅ User profile management  
✅ Add/view children  

## Next Steps

The app is ready for you to implement:
- Create tasks
- Manage rewards
- Mark tasks complete
- Redeem rewards
- Parent analytics dashboard

## Troubleshooting

**"Database connection failed"**
- Make sure PostgreSQL is running: `docker-compose up postgres`
- Check DATABASE_URL in `.env.local`

**"OAuth redirect URI mismatch"**
- Ensure registered URIs in Google Cloud Console match your app URLs
- Don't include trailing slashes in URIs

**"Cannot find module"**
- Run `npm install` in both `backend/` and `frontend/`
- Clear node_modules: `rm -rf node_modules && npm install`

**Port already in use**
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

## Useful Commands

```bash
# Backend
npm run dev          # Start dev server
npm run lint         # Check code style
npm run test         # Run tests
npm run db:migrate   # Run migrations
npm run db:rollback  # Undo migrations

# Frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Check code style
npm run type-check   # TypeScript checking

# Root (monorepo)
npm run dev          # Start everything
npm run build        # Build both apps
npm run lint         # Lint everything
```

## File Structure

```
tinyChanges/
├── backend/          # Node.js/Express API
│   └── src/
│       ├── routes/
│       ├── models/
│       ├── services/
│       └── middleware/
├── frontend/         # Next.js web app
│   └── app/
│       ├── (auth)/
│       ├── (dashboard)/
│       └── api/
└── docs/            # Documentation
```

## Need Help?

- 📚 Check `docs/DEVELOPMENT.md` for detailed setup
- 🏗️ See `docs/ARCHITECTURE.md` for system overview
- 📝 Read `docs/API.md` for API endpoints
- 💬 Open an issue on GitHub

Happy coding! 🎯
