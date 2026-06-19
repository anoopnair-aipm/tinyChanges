# tinyChanges Production Deployment Guide

## Quick Deployment with Vercel + Railway

This guide walks through deploying tinyChanges to production using Vercel (frontend) and Railway (backend + database).

### Prerequisites
- GitHub account (repo already connected)
- Vercel account (free): https://vercel.com
- Railway account (free): https://railway.app
- Google OAuth credentials (you have these)

## Step 1: Deploy Backend + Database on Railway

### 1.1 Create Railway Project
1. Go to https://railway.app and sign up
2. Click "New Project"
3. Select "GitHub Repo" → Select `tinyChanges`
4. Railway will detect it's a monorepo

### 1.2 Add PostgreSQL Database
1. In your Railway project, click "Add Service"
2. Select "PostgreSQL"
3. Railway will automatically provision the database

### 1.3 Configure Backend Service
1. Click "Add Service" → "GitHub Repo"
2. Select the same repo
3. Set the following environment variables in Railway:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=[Railway will auto-populate from PostgreSQL service]
   GOOGLE_CLIENT_ID=930156448456-nud6c42vgcgti0irjqk0i7q7knvf8jch.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=[Your secret from Google Cloud]
   JWT_SECRET=[Generate a new secure random string]
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   LOG_LEVEL=info
   ```

4. Configure build command:
   - Build: `npm install && npm run build -w backend`
   - Start: `npm start -w backend`

5. Deploy → Copy the Railway backend URL (you'll need this for frontend)

## Step 2: Deploy Frontend on Vercel

### 2.1 Create Vercel Project
1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project"
3. Import the `tinyChanges` GitHub repo
4. Framework: Next.js (auto-detected)

### 2.2 Configure Environment Variables
Set these in Vercel project settings:
```
NEXT_PUBLIC_API_URL=[Your Railway backend URL from Step 1.5]
NEXT_PUBLIC_GOOGLE_CLIENT_ID=930156448456-nud6c42vgcgti0irjqk0i7q7knvf8jch.apps.googleusercontent.com
NEXT_PUBLIC_DEBUG=false
```

### 2.3 Build Settings
- Root Directory: `frontend`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: `.next`

### 2.4 Deploy
Click "Deploy" → Wait for deployment to complete

## Step 3: Update Google OAuth

Your Google OAuth redirect URI changed. Update it in Google Cloud Console:

1. Go to: https://console.cloud.google.com/
2. Select your project
3. Go to: APIs & Services → Credentials
4. Click your OAuth 2.0 Client
5. Update "Authorized redirect URIs":
   - Add: `https://your-vercel-domain.vercel.app/api/auth/callback`
   - Keep: `http://localhost:3000/api/auth/callback` (for local dev)

## Step 4: Database Migrations

Run migrations on production database:

```bash
# Via Railway CLI:
railway run npm run db:migrate

# Or manually in Railway PostgreSQL shell
```

## Step 5: Test Production

1. Visit your Vercel URL
2. Test parent login with Google
3. Create a task
4. Test child login
5. Complete a task and earn reward

## Troubleshooting

**502 Bad Gateway on Vercel?**
- Check Railway backend logs
- Verify DATABASE_URL is correct
- Verify FRONTEND_URL is set in Railway

**Login not working?**
- Verify Google OAuth redirect URI is updated
- Check GOOGLE_CLIENT_ID matches in both frontend and backend
- Check logs for JWT errors

**Database connection issues?**
- Verify DATABASE_URL format in Railway
- Run `npm run db:migrate` on production database
- Check PostgreSQL is running in Railway

## Rollback

If you need to rollback:
- Vercel: Click "Rollback" on previous deployment
- Railway: Same approach - select previous deployment

## Cost

Free tier should cover testing:
- **Vercel**: Free tier sufficient for MVP
- **Railway**: $5/month credits, $0.50/GB bandwidth
- **PostgreSQL**: Free tier included with Railway

For production with users, expect to use Railway's paid tier (~$5-20/month).

## Support

Check logs:
- Vercel: Deployment logs in project dashboard
- Railway: Service logs in Railway dashboard
- Database: PostgreSQL logs in Railway

---

**Deployment complete!** Share your Vercel URL with your friend.
