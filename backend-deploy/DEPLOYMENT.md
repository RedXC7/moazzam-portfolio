# Muhammad Moazzam - Deployment Guide

## Frontend (Website) → Vercel
1. Go to https://vercel.com/new
2. Drag & drop `web2/` folder onto Vercel
3. Your website is LIVE ✅

**URL Format**: `https://moazzam-portfolio-xxxxx.vercel.app`

---

## Backend (AI Agent) → Render

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `moazzam-ai-backend`
3. Upload these files from `backend-deploy/`:
   - `api.py`
   - `requirements.txt`
   - `render.yaml`
   - `.env.example`

### Step 2: Deploy to Render
1. Go to https://render.com
2. Click **New** → **Web Service**
3. Connect your `moazzam-ai-backend` GitHub repo
4. Render auto-configures using `render.yaml`
5. Deploy directly. No API key is required for the simplified FAQ backend.

### Step 3: Update Frontend to Use Backend
After backend deploys, Render gives you a URL like: `https://moazzam-ai-backend.onrender.com`

Update the API base URL in `web2/index.html`:
```html
<meta name="api-base-url" content="https://moazzam-ai-backend.onrender.com">
```

Then redeploy to Vercel.

---

## Summary
| Part | Platform | Status |
|------|----------|--------|
| Website + Images | Vercel | ✅ Ready |
| AI Chat Backend | Render or Replit | ✅ Ready |
| Video | Upload later | Will auto-display |

Your website + AI agent will stay online 24/7 for FREE!
