# Google OAuth Setup Guide

Follow these steps to get your Google OAuth credentials.

## Step 1: Go to Google Cloud Console

Visit: **https://console.cloud.google.com/**

If you don't have a Google account, create one first.

## Step 2: Create a New Project

1. At the top, click the **project dropdown** (where it says "My First Project" or similar)
2. Click **"NEW PROJECT"**
3. Enter project name: **tinyChanges**
4. Click **"CREATE"**
5. Wait for the project to be created (this may take a minute)

## Step 3: Enable Google+ API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it
4. Click the blue **"ENABLE"** button
5. Wait for it to activate

## Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Choose **"OAuth client ID"**
4. If prompted, click **"CONFIGURE CONSENT SCREEN"** first:
   - Choose **"External"**
   - Click **"CREATE"**
   - Fill in:
     - **App name**: tinyChanges
     - **User support email**: your email
     - **Developer contact**: your email
   - Click **"SAVE AND CONTINUE"** (skip optional fields)
   - Click **"SAVE AND CONTINUE"** again
   - Click **"BACK TO DASHBOARD"**

5. Now click **"+ CREATE CREDENTIALS"** again → **"OAuth client ID"**
6. Choose **"Web application"**
7. Give it a name: **tinyChanges Web Client**
8. Under **"Authorized redirect URIs"**, add these URLs:
   - `http://localhost:3000/api/auth/callback`
   - `http://localhost:3000/auth/callback`
9. Click **"CREATE"**

## Step 5: Copy Your Credentials

A popup will appear with:
- **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abc123...`)

⚠️ **IMPORTANT**: Copy these to a safe place! You'll need them next.

You can also find these anytime by:
1. Going to **Credentials**
2. Under **"OAuth 2.0 Client IDs"**
3. Clicking your **"tinyChanges Web Client"**

## What You Get

```
Client ID:     ____________________________________
Client Secret: ____________________________________
```

Write them down or keep the tab open - you'll need these in the next step!

## Troubleshooting

**"Consent screen not configured"**
- Go to OAuth consent screen and configure it first
- Choose "External" for user type

**"Redirect URI mismatch error"**
- Make sure you added BOTH URIs exactly:
  - `http://localhost:3000/api/auth/callback`
  - `http://localhost:3000/auth/callback`
- No trailing slashes!

**Can't find Google+ API**
- Make sure Google+ API is enabled in the Library
- Search for "Google+ API" (not just "Google")

---

**Next**: Go to "Step 2: Configure Environment Variables" in QUICK_START.md
