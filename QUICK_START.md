# Quick Start Guide 🚀

Get tinyChanges running locally in 10 minutes!

## Prerequisites

- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ Docker ([Download](https://www.docker.com/products/docker-desktop)) OR PostgreSQL installed
- ✅ Google account

## Step 1: Get Google OAuth Credentials 🔑

**Detailed instructions**: See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

Quick summary:
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: **tinyChanges**
3. Enable **Google+ API**
4. Create OAuth 2.0 credentials:
   - Type: **Web application**
   - Name: **tinyChanges Web Client**
   - Redirect URIs:
     - `http://localhost:3000/api/auth/callback`
     - `http://localhost:3000/auth/callback`
5. Copy your **Client ID** and **Client Secret**

🎯 **Have them ready before Step 2!**

## Step 2: Set Up Environment Variables 🔐

### Backend Configuration

Create `backend/.env.local`:
```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://tinychanges:tinychanges_dev@localhost:5432/tinychanges_dev
GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=PASTE_YOUR_CLIENT_SECRET_HERE
JWT_SECRET=my_super_secret_jwt_key_tinychanges_2026
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration

Create `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
```

✅ **Replace the placeholders with your actual credentials!**

## Step 3: Start PostgreSQL 🐘

### Option A: Using Docker (Recommended)
```bash
docker-compose up -d postgres
```

Verify it's running:
```bash
docker ps
```

You should see `tinychanges-db` in the list.

### Option B: Using Local PostgreSQL
```bash
# Create the database
createdb -U postgres tinychanges_dev

# Or if you have a different setup:
psql -U your_username -d postgres -c "CREATE DATABASE tinychanges_dev;"
```

## Step 4: Install Dependencies 📦

From the project root:
```bash
npm install
```

This installs dependencies for both backend and frontend.

## Step 5: Run Database Migrations 🗄️

```bash
cd backend
npm run db:init
```

You should see:
```
🔄 Running database migrations...
✓ Executed: CREATE TABLE IF NOT EXISTS users...
✓ Executed: CREATE TABLE IF NOT EXISTS tasks...
...
✅ Migrations completed successfully
```

## Step 6: Start Development Servers 🚀

### Option A: Start Everything Together (Easiest)

From the project root:
```bash
npm run dev
```

This starts both backend and frontend in parallel.

You'll see:
```
Backend: 🚀 Server running on http://localhost:5000
Frontend: ▲ Next.js ready on http://localhost:3000
```

### Option B: Start Separately (If you need to debug)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 7: Test the App! 🎉

### Test Parent Login:
1. Open **http://localhost:3000**
2. Click **"Get Started"**
3. Click **"Sign in with Google"**
4. Log in with your Google account
5. You should see the parent dashboard ✅

### Test Adding a Child:
1. On the parent dashboard, click **"+ Add Child"**
2. Enter a child's name and email (e.g., `tommy@example.com`)
3. Click **"Save Child"**
4. You should see the child listed ✅

### Test Child Login:
1. Go to **http://localhost:3000/login/child**
2. Click **"Sign in with Google"**
3. Log in with the **child's email** you added
4. You should see the child dashboard ✅

### Success! 🎊
If you see both dashboards working, your setup is complete!

## Verify Everything Works

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Should return:
# {"status":"ok","database":"connected","timestamp":"..."}
```

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
