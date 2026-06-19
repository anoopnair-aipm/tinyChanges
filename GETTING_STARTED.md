# Getting Started with tinyChanges 🎯

This guide walks you through the complete setup process from start to finish.

**Time needed:** ~15-20 minutes  
**Prerequisites:** Node.js 18+, Docker or PostgreSQL

---

## 📋 Complete Workflow

```
1. Get Google OAuth Credentials (5 min)
   ↓
2. Configure Environment Variables (2 min)
   ↓
3. Start PostgreSQL (1 min)
   ↓
4. Install Dependencies (3 min)
   ↓
5. Run Database Migrations (1 min)
   ↓
6. Start Development Servers (1 min)
   ↓
7. Test the Application (5 min)
```

---

## Part 1: Get Google OAuth Credentials ✅

### What You Need
- Google account (Gmail or Google Workspace)
- Internet connection
- ~5 minutes

### Detailed Steps

1. **Open Google Cloud Console**
   - Go to: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - At the top, click the **project dropdown**
   - Click **"NEW PROJECT"**
   - Name: `tinyChanges`
   - Click **"CREATE"**
   - Wait 1-2 minutes for project creation

3. **Enable Google+ API**
   - Left sidebar → **"APIs & Services"** → **"Library"**
   - Search for `"Google+ API"`
   - Click on it
   - Click **"ENABLE"** button
   - Wait for activation

4. **Set Up OAuth Consent Screen**
   - Left sidebar → **"APIs & Services"** → **"Credentials"**
   - You'll see a warning about needing the consent screen
   - Click **"CONFIGURE CONSENT SCREEN"**
   - Choose **"External"** → **"CREATE"**
   - Fill in:
     ```
     App name: tinyChanges
     User support email: your-email@gmail.com
     Developer contact email: your-email@gmail.com
     ```
   - Click **"SAVE AND CONTINUE"**
   - Skip the optional scopes
   - Click **"SAVE AND CONTINUE"**
   - Review and click **"BACK TO DASHBOARD"**

5. **Create OAuth 2.0 Credentials**
   - Back in **Credentials** page
   - Click **"+ CREATE CREDENTIALS"**
   - Choose **"OAuth client ID"**
   - Application type: **"Web application"**
   - Name: `tinyChanges Web Client`
   - **Authorized redirect URIs** - Add these exactly:
     ```
     http://localhost:3000/api/auth/callback
     http://localhost:3000/auth/callback
     ```
   - Click **"CREATE"**

6. **Copy Your Credentials**
   - A popup appears with your credentials
   - Copy these **two values**:
     - **Client ID** (e.g., `123456789-abc123.apps.googleusercontent.com`)
     - **Client Secret** (e.g., `GOCSPX-abc123def456...`)
   - Save them somewhere safe (notepad, password manager, etc.)

✅ **You now have your Google OAuth credentials!**

---

## Part 2: Configure Environment Variables 🔐

### What You'll Do
- Create configuration files with your credentials
- Keep secrets private (never commit .env.local)

### Backend Setup

1. **Open terminal/command prompt**
2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Create `.env.local` file**
   - Create new file: `backend/.env.local`
   - Copy this content:
   ```bash
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=postgresql://tinychanges:tinychanges_dev@localhost:5432/tinychanges_dev
   GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
   GOOGLE_CLIENT_SECRET=PASTE_YOUR_CLIENT_SECRET_HERE
   JWT_SECRET=my_super_secret_jwt_key_tinychanges_2026
   FRONTEND_URL=http://localhost:3000
   LOG_LEVEL=debug
   ```

4. **Replace placeholders**
   - Find: `PASTE_YOUR_CLIENT_ID_HERE`
   - Replace with: your Client ID from Step 1
   - Find: `PASTE_YOUR_CLIENT_SECRET_HERE`
   - Replace with: your Client Secret from Step 1
   - Save the file

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Create `.env.local` file**
   - Create new file: `frontend/.env.local`
   - Copy this content:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
   NEXT_PUBLIC_DEBUG=false
   ```

3. **Replace placeholders**
   - Find: `PASTE_YOUR_CLIENT_ID_HERE`
   - Replace with: **same Client ID** from Step 1
   - Save the file

✅ **Your app is now configured!**

---

## Part 3: Start PostgreSQL 🐘

### Option A: Using Docker (Recommended)

```bash
# From project root directory
docker-compose up -d postgres

# Verify it's running
docker ps
```

You should see `tinychanges-db` in the output.

### Option B: Using Local PostgreSQL

```bash
# Create the database
createdb -U postgres tinychanges_dev

# Verify it works
psql -U postgres -d tinychanges_dev -c "SELECT 1;"
```

Should return `1`.

✅ **Database is running!**

---

## Part 4: Install Dependencies 📦

```bash
# Navigate to project root
cd /Users/anoopnair/my_Claude_workSpace/TinyChanges

# Install all dependencies
npm install

# This may take 2-3 minutes...
```

You should see:
```
added XXX packages in XXXs
```

✅ **Dependencies installed!**

---

## Part 5: Run Database Migrations 🗄️

```bash
# Navigate to backend
cd backend

# Run migrations
npm run db:init

# You should see:
# 🔄 Running database migrations...
# ✓ Executed: CREATE TABLE IF NOT EXISTS users...
# ...
# ✅ Migrations completed successfully
```

✅ **Database schema created!**

---

## Part 6: Start Development Servers 🚀

### Option A: Start Everything Together (Easiest)

From project root:
```bash
npm run dev
```

You'll see both servers start:
```
🚀 Server running on http://localhost:5000
▲ Next.js ready on http://localhost:3000
```

### Option B: Start Separately

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

✅ **Both servers are running!**

---

## Part 7: Test the Application 🎉

### Test 1: Homepage

1. Open **http://localhost:3000** in your browser
2. You should see the colorful tinyChanges homepage
3. See "Get Started" and "Learn More" buttons
4. ✅ Frontend is working!

### Test 2: Parent Login

1. Click **"Get Started"**
2. Click **"Sign in with Google"**
3. You're redirected to Google login
4. Log in with your Google account
5. You're redirected back to the app
6. You see the **parent dashboard** with:
   - Welcome message
   - "Your Children (0)" section
   - "+ Add Child" button
7. ✅ Parent authentication works!

### Test 3: Add a Child

1. Click **"+ Add Child"** button
2. Fill in:
   - **Child's Name**: `Tommy` (or any name)
   - **Email**: `tommy@gmail.com` (use a real email address)
3. Click **"Save Child"**
4. You see: **"✅ Added Tommy to your account!"**
5. Child appears in the list with "Manage Tasks" and "Manage Rewards" buttons
6. ✅ Child creation works!

### Test 4: Child Login

1. **Important**: Open a new incognito/private browser window
   - This ensures you're not logged in as the parent
   - Windows: Ctrl+Shift+N
   - Mac: Cmd+Shift+N

2. Go to **http://localhost:3000/login/child**

3. Click **"Sign in with Google"**

4. Log in with the **child's email** you added (e.g., `tommy@gmail.com`)
   - This is important! You must use the same email you added as the child

5. You're logged in as the child and see:
   - **Child dashboard**
   - Welcome message with child's name
   - Tasks section (0 tasks)
   - Rewards section (0 rewards)
   - Profile shows "👶 Child" in header

6. ✅ Child authentication works!

### Test 5: Logout

1. Click **"Logout"** button in header
2. You're redirected to home page
3. Try to access dashboard directly: **http://localhost:3000/dashboard/child**
4. You're redirected to login
5. ✅ Protected routes work!

### Test 6: Verify Backend API

Open a terminal and run:
```bash
curl http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok","database":"connected","timestamp":"..."}
```

✅ **Backend is healthy!**

---

## 🎊 Success!

If all tests passed, your tinyChanges application is **fully functional**! 

### What You Have Now:
- ✅ Working Google OAuth authentication
- ✅ Parent and child accounts
- ✅ Protected dashboards
- ✅ Database with user data
- ✅ Complete API backend
- ✅ Production-ready frontend

---

## 📚 Next Steps

### Option 1: Explore the Codebase
- `backend/src/models/User.ts` - User data model
- `backend/src/routes/auth.ts` - Authentication routes
- `frontend/app/(auth)/login/page.tsx` - Login page
- `frontend/app/(dashboard)/` - Protected pages

### Option 2: Start Phase 2 - Task Management
See [Phase 2 Implementation Guide](./PHASE_2_TASKS.md) (coming soon)

### Option 3: Deploy to Production
See [Deployment Guide](./docs/DEPLOYMENT.md)

### Option 4: Customize the UI
- Change colors in `frontend/app/globals.css`
- Modify tailwind config in `frontend/tailwind.config.ts`
- Update components in `frontend/components/`

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Failed
```bash
# Make sure Docker is running
docker ps

# Or check local PostgreSQL
psql -U postgres -d tinychanges_dev
```

### OAuth Error: "Redirect URI mismatch"
- Check your registered URIs in Google Cloud Console
- Must be **exactly**:
  - `http://localhost:3000/api/auth/callback`
  - `http://localhost:3000/auth/callback`
- No trailing slashes!

### Child Login Doesn't Work
- Make sure you're using the **exact email** you added as the child
- Use an incognito/private window to avoid cached parent login
- Check that the email exists in the database (it should appear on parent dashboard)

### Still Having Issues?
1. Check terminal output for error messages
2. Open browser DevTools (F12) and check console
3. See `docs/DEVELOPMENT.md` for detailed troubleshooting

---

## 🎯 Common Questions

**Q: Can I use my own Google account for testing both parent and child?**  
A: No, they need different email addresses. You can create a test Google account.

**Q: What if I mess up the database?**  
A: Run this to reset it:
```bash
cd backend
npm run db:rollback
npm run db:init
```

**Q: How do I change the port numbers?**  
A: Update `.env.local` files:
```bash
# backend/.env.local - change PORT=5000
# frontend - change next.config.js NEXT_PUBLIC_API_URL
```

**Q: Is this data persisted if I restart the server?**  
A: Yes! PostgreSQL stores it. Only the server process restarts.

---

## ✨ You're All Set!

Your tinyChanges app is now running locally with full authentication. 

🎉 **Enjoy building!**

Questions? Check the documentation files or open an issue on GitHub.
