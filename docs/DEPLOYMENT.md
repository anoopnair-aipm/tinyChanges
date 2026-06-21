# Deployment Guide

## Current Production Stack

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | https://tiny-changes-frontend-kfxe.vercel.app |
| Backend API | Railway | https://tinychanges-api-production.up.railway.app |
| Database | Railway PostgreSQL | Railway managed |

Auto-deployment is active: pushing to `main` deploys both frontend (Vercel) and backend (Railway) automatically.

---

## How Auto-Deploy Works

**Frontend (Vercel)**:
1. Push to `main` branch on GitHub
2. Vercel detects the push, runs `npm run build` in the `frontend/` directory
3. New deployment is live within ~1-2 minutes

**Backend (Railway)**:
1. Push to `main` branch on GitHub
2. Railway detects the push, builds the Docker image from `backend/Dockerfile`
3. New container is deployed; on startup, the backend auto-applies DB migrations
4. New deployment is live within ~2-3 minutes

---

## Environment Variables

### Backend (set in Railway service dashboard)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Set to `production` |
| `PORT` | Railway sets this automatically; defaults to `5000` |
| `DATABASE_URL` | Railway provides this automatically for linked PostgreSQL service |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console OAuth 2.0 credentials |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console OAuth 2.0 credentials |
| `JWT_SECRET` | Long random string, used to sign JWTs |
| `FRONTEND_URL` | `https://tiny-changes-frontend-kfxe.vercel.app` (used for CORS) |

### Frontend (set in Vercel project settings)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://tinychanges-api-production.up.railway.app` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | From Google Cloud Console OAuth 2.0 credentials |

---

## Setting Up From Scratch

Follow these steps if you need to redeploy to a new Railway or Vercel account.

### Step 1: Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select an existing one)
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback` (local dev)
   - `https://<your-vercel-url>/api/auth/callback` (production)
7. Copy the **Client ID** and **Client Secret**

### Step 2: Deploy the Backend to Railway

1. Go to [railway.app](https://railway.app) and log in
2. Click **New Project > Deploy from GitHub repo**
3. Select the `tinyChanges` repository
4. Set the **Root Directory** to `backend`
5. Railway will detect the `Dockerfile` and build automatically

6. Add a **PostgreSQL** service to the same Railway project:
   - Click **New Service > Database > PostgreSQL**
   - Railway automatically sets `DATABASE_URL` in your backend service

7. Add environment variables to the backend service:
   ```
   NODE_ENV=production
   GOOGLE_CLIENT_ID=<from step 1>
   GOOGLE_CLIENT_SECRET=<from step 1>
   JWT_SECRET=<generate a long random string>
   FRONTEND_URL=https://<your-vercel-url>
   ```

8. Railway will build and deploy. The backend auto-runs DB migrations on first boot — no manual commands needed.

9. Copy the Railway-generated public URL for your backend service (e.g., `https://tinychanges-api-production.up.railway.app`)

### Step 3: Deploy the Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **New Project > Import Git Repository**
3. Select the `tinyChanges` repository
4. Set the **Root Directory** to `frontend`
5. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://<your-railway-backend-url>
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=<from step 1>
   ```
6. Click **Deploy**
7. Copy the Vercel URL (e.g., `https://tiny-changes-frontend-kfxe.vercel.app`)

### Step 4: Update Cross-References

1. In Railway backend service, update `FRONTEND_URL` to your Vercel URL
2. In Google Cloud Console, ensure the Vercel URL's callback is in your authorized redirect URIs: `https://<your-vercel-url>/api/auth/callback`
3. Redeploy the backend on Railway (or trigger via git push) so it picks up the updated `FRONTEND_URL`

---

## Verifying the Deployment

```bash
# Health check
curl https://tinychanges-api-production.up.railway.app/api/health

# Expected response:
# {"status":"ok","database":"connected","timestamp":"..."}
```

If `"database":"connected"`, the backend is running and the database connection is working.

---

## Database

The database schema is created automatically by the backend on startup. You do not need to run any migration scripts manually.

If you need to inspect the database directly, use the Railway dashboard's built-in PostgreSQL client, or use a tool like `psql` with the `DATABASE_URL` from the Railway service variables.

---

## Rollbacks

**Frontend**: Vercel keeps deployment history. Go to the Vercel dashboard, select a previous deployment, and click **Redeploy**.

**Backend**: Railway keeps deployment history. Go to the Railway dashboard, select a previous deployment, and click **Rollback**.

---

## Monitoring

- **Health endpoint**: `GET /api/health` — check periodically to verify the backend and database are up
- **Vercel dashboard**: Shows build logs, deployment status, and function logs
- **Railway dashboard**: Shows build logs, deployment status, resource usage, and PostgreSQL metrics

---

## Security Checklist Before Going Live

- [ ] `JWT_SECRET` is a long (32+ characters) random string — not a dictionary word
- [ ] `GOOGLE_CLIENT_SECRET` is stored only in Railway env vars, not in source code
- [ ] `NEXT_PUBLIC_*` variables contain only non-secret values (they are visible in browser bundles)
- [ ] Google OAuth consent screen only has the required scopes (email, profile)
- [ ] Vercel deployment protection is configured appropriately for your use case
- [ ] Railway PostgreSQL is not exposed publicly (it communicates internally with the backend service)
