# Setup Checklist ✅

Use this checklist to ensure everything is configured correctly.

## Prerequisites
- [ ] Node.js 18+ installed (`node --version` should show v18+)
- [ ] Docker installed (`docker --version`) OR PostgreSQL installed locally
- [ ] Git installed (`git --version`)

## Google OAuth Setup
- [ ] Google Cloud Console account created
- [ ] New project created: "tinyChanges"
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created (Web application)
- [ ] Redirect URIs added:
  - [ ] `http://localhost:3000/api/auth/callback`
  - [ ] `http://localhost:3000/auth/callback`
- [ ] Client ID copied ✍️ `___________________________`
- [ ] Client Secret copied ✍️ `___________________________`

## Environment Variables Setup

### Backend Configuration
- [ ] Navigate to `backend/` directory
- [ ] Create `backend/.env.local` file
- [ ] Copy contents from `backend/.env.example`
- [ ] Fill in with your values:
  ```
  NODE_ENV=development
  PORT=5000
  DATABASE_URL=postgresql://tinychanges:tinychanges_dev@localhost:5432/tinychanges_dev
  GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
  GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
  JWT_SECRET=my_super_secret_jwt_key_tinychanges_2026
  FRONTEND_URL=http://localhost:3000
  ```
- [ ] Save and verify no trailing spaces

### Frontend Configuration
- [ ] Navigate to `frontend/` directory
- [ ] Create `frontend/.env.local` file
- [ ] Copy contents from `frontend/.env.example`
- [ ] Fill in with your values:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:5000
  NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
  ```
- [ ] Save and verify no trailing spaces

## Database Setup
- [ ] **Docker Method:**
  - [ ] Run `docker-compose up -d postgres`
  - [ ] Verify with `docker ps` (see `tinychanges-db` container)

  **OR**
  
  **Local PostgreSQL Method:**
  - [ ] PostgreSQL service is running
  - [ ] Create database: `createdb -U postgres tinychanges_dev`

- [ ] Verify connection works:
  ```bash
  psql postgresql://tinychanges:tinychanges_dev@localhost:5432/tinychanges_dev -c "SELECT 1;"
  ```
  Should return: `1`

## Installation & Migrations
- [ ] Navigate to project root directory
- [ ] Run `npm install` (installs all dependencies)
- [ ] Verify installation: `npm --version` shows npm 9+
- [ ] Run `npm run db:init` (creates database schema)
- [ ] Verify migrations completed with "✅ Migrations completed successfully"

## Start Development Servers
- [ ] Open terminal/command prompt in project root
- [ ] Run `npm run dev`
- [ ] Verify output shows:
  - Backend: `🚀 Server running on http://localhost:5000`
  - Frontend: `▲ Next.js ready on http://localhost:3000`

## Test Parent Login
- [ ] Open **http://localhost:3000** in browser
- [ ] Click **"Get Started"**
- [ ] Click **"Sign in with Google"**
- [ ] You're redirected to Google login
- [ ] Log in with your Google account
- [ ] Redirected back to app
- [ ] See parent dashboard with "Your Children (0)"
- [ ] Username and profile picture visible in header

## Test Adding a Child
- [ ] On parent dashboard, click **"+ Add Child"**
- [ ] Enter child name: `Tommy` (example)
- [ ] Enter child email: `tommy@gmail.com` (must be a real email)
- [ ] Click **"Save Child"**
- [ ] See success message: "✅ Added Tommy to your account!"
- [ ] Child appears in children list
- [ ] Can see "Manage Tasks" and "Manage Rewards" buttons

## Test Child Login
- [ ] In new incognito/private browser window
- [ ] Go to **http://localhost:3000/login/child**
- [ ] Click **"Sign in with Google"**
- [ ] Log in with the **child's email** you added (e.g., `tommy@gmail.com`)
- [ ] You're logged in as the child
- [ ] See child dashboard with tasks and rewards
- [ ] Username in header shows as "👶 Child"

## Test Logout & Switch Accounts
- [ ] Click **"Logout"** button in header
- [ ] Redirected to home page
- [ ] Go back to **http://localhost:3000**
- [ ] Redirected to login (not dashboard) ✅

## API Verification
- [ ] Open terminal
- [ ] Run: `curl http://localhost:5000/api/health`
- [ ] Should return: `{"status":"ok","database":"connected"...}`

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
docker ps

# Check connection
psql postgresql://tinychanges:tinychanges_dev@localhost:5432/tinychanges_dev
```

### OAuth Redirect Mismatch
- Verify registered URIs in Google Cloud Console
- No trailing slashes!
- Exactly: `http://localhost:3000/api/auth/callback`

### Dependencies Not Installed
```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

---

## ✅ All Done!

If all checkboxes are completed, your tinyChanges app is fully set up and running!

**Next Steps:**
1. Explore the parent and child dashboards
2. Try the UI navigation
3. Check the code in `/frontend` and `/backend`
4. Start Phase 2: Implement Task Management

🎉 **Congratulations on getting tinyChanges running locally!**
