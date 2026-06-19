# Execute Setup Now 🚀

Copy-paste these commands in order. Takes ~15 minutes total.

---

## Step 1: Get Google OAuth Credentials (5 min) 🔑

### 📱 In Your Browser:

1. Visit: https://console.cloud.google.com/
2. Sign in with Google
3. Click **project dropdown** at top
4. Click **"NEW PROJECT"**
5. Enter: `tinyChanges`
6. Click **"CREATE"** (wait 1-2 minutes)

### Enable API:
1. Left sidebar → **APIs & Services** → **Library**
2. Search: `"Google+ API"`
3. Click it → Click **"ENABLE"**

### Set Up Consent Screen:
1. Left sidebar → **Credentials**
2. Click **"CONFIGURE CONSENT SCREEN"**
3. Choose **"External"** → **"CREATE"**
4. Fill in your email
5. Click **"SAVE AND CONTINUE"** twice
6. Click **"BACK TO DASHBOARD"**

### Create OAuth Credentials:
1. Click **"+ CREATE CREDENTIALS"**
2. Choose **"OAuth client ID"**
3. Select **"Web application"**
4. Name: `tinyChanges Web Client`
5. **Authorized redirect URIs** - Copy-paste these:
   ```
   http://localhost:3000/api/auth/callback
   http://localhost:3000/auth/callback
   ```
6. Click **"CREATE"**

### 📋 Copy These Values:
```
CLIENT_ID: ____________________________________
CLIENT_SECRET: ____________________________________
```

Write them down or keep the tab open!

✅ **Done with Google setup!**

---

## Step 2: Configure Local Files (2 min) ⚙️

### 📁 Open File Manager

Navigate to: `/Users/anoopnair/my_Claude_workSpace/TinyChanges`

### Create Backend Config:
Create file: `backend/.env.local`

Copy-paste this (replace the placeholders):
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://tinychanges:tinychanges_dev@localhost:5432/tinychanges_dev
GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=PASTE_YOUR_CLIENT_SECRET_HERE
JWT_SECRET=my_super_secret_jwt_key_tinychanges_2026
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
```

Replace:
- `PASTE_YOUR_CLIENT_ID_HERE` → Your Client ID from Step 1
- `PASTE_YOUR_CLIENT_SECRET_HERE` → Your Client Secret from Step 1

Save the file.

### Create Frontend Config:
Create file: `frontend/.env.local`

Copy-paste this (replace the placeholder):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
NEXT_PUBLIC_DEBUG=false
```

Replace:
- `PASTE_YOUR_CLIENT_ID_HERE` → Same Client ID as above

Save the file.

✅ **Files created!**

---

## Step 3: Open Terminal (1 min) 💻

Open your terminal/command prompt and run:

```bash
cd /Users/anoopnair/my_Claude_workSpace/TinyChanges
```

Verify you're in the right place:
```bash
pwd
```

Should show: `/Users/anoopnair/my_Claude_workSpace/TinyChanges`

✅ **Terminal ready!**

---

## Step 4: Start Database (1 min) 🐘

In the same terminal:

```bash
docker-compose up -d postgres
```

Verify it's running:
```bash
docker ps
```

You should see `tinychanges-db` in the list.

✅ **Database running!**

---

## Step 5: Install & Migrate (4 min) 📦

In the same terminal:

```bash
npm install
```

Wait for it to finish (you'll see "added XXX packages").

Then run migrations:
```bash
cd backend
npm run db:init
```

You should see:
```
✅ Migrations completed successfully
```

✅ **Ready to run!**

---

## Step 6: Start the App (1 min) 🚀

Still in the `backend` directory, go back to root:

```bash
cd ..
```

Start everything:
```bash
npm run dev
```

Wait for both to start. You'll see:
```
🚀 Server running on http://localhost:5000
▲ Next.js ready on http://localhost:3000
```

Keep this terminal open!

✅ **App is running!**

---

## Step 7: Test It! (5 min) 🎉

### Test Parent Login:
1. Open browser: **http://localhost:3000**
2. Click **"Get Started"**
3. Click **"Sign in with Google"**
4. Log in with your Google account
5. You should see: **Parent Dashboard** ✅

### Add a Child:
1. Click **"+ Add Child"**
2. Name: `Tommy`
3. Email: `tommy@gmail.com` (must be valid email)
4. Click **"Save Child"**
5. See: **"✅ Added Tommy to your account!"** ✅

### Test Child Login:
1. Open **new incognito window**: Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)
2. Go to: **http://localhost:3000/login/child**
3. Click **"Sign in with Google"**
4. Log in with: **`tommy@gmail.com`** (the child's email)
5. You should see: **Child Dashboard** ✅

### Verify API:
Open new terminal:
```bash
curl http://localhost:5000/api/health
```

Should return something like:
```
{"status":"ok","database":"connected","timestamp":"..."}
```

✅ **Everything works!**

---

## 🎊 Success!

Your tinyChanges app is fully set up and running!

### You now have:
✅ Google OAuth authentication  
✅ Parent and child accounts  
✅ Working dashboards  
✅ Database persistence  
✅ Production-ready code  

---

## 📖 What's Next?

### Option 1: Explore Code
```bash
# Look at the authentication
code frontend/app/(auth)/login/page.tsx

# Look at the dashboard
code frontend/app/(dashboard)/dashboard/parent/page.tsx

# Look at the backend
code backend/src/routes/auth.ts
```

### Option 2: Implement Phase 2 - Tasks
I can help you add:
- Create tasks
- List tasks
- Mark complete
- Task UI

Ask me: "Let's build task management"

### Option 3: Test More Features
Try logging out and back in, switching between parent and child accounts, adding multiple children, etc.

---

## 🆘 If Something Goes Wrong

### Port in use?
```bash
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Database error?
```bash
docker-compose down
docker-compose up -d postgres
cd backend && npm run db:init
npm run dev
```

### Can't find files?
Make sure you're in: `/Users/anoopnair/my_Claude_workSpace/TinyChanges`

```bash
cd /Users/anoopnair/my_Claude_workSpace/TinyChanges
ls -la
```

### Child login fails?
- Use exact email you added
- Use incognito/private window
- Check the email is in parent dashboard

---

## 🎯 Keep This Open

Bookmark or pin these docs:
- `GETTING_STARTED.md` - Detailed explanation
- `QUICK_START.md` - Quick reference
- `docs/API.md` - API endpoints
- `docs/DEVELOPMENT.md` - Dev help

---

## ✨ You're Done!

Your tinyChanges app is running. Now you can:
- Add more features
- Customize the UI
- Deploy to production
- Share with others

**Enjoy building! 🚀**
