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
5. Add Environment Variable:
   - Key: `GOOGLE_API_KEY`
   - Value: [Your Google Gemini API key]

### Step 3: Update Frontend to Use Backend
After backend deploys, Render gives you a URL like: `https://moazzam-ai-backend.onrender.com`

Update `web2/script.js` line ~87:
```javascript
const API_BASE = 'https://moazzam-ai-backend.onrender.com';
```

Then redeploy to Vercel.

---

## Summary
| Part | Platform | Status |
|------|----------|--------|
| Website + Images | Vercel | ✅ Ready |
| AI Chat Backend | Render | ✅ Ready |
| Video | Upload later | Will auto-display |

Your website + AI agent will stay online 24/7 for FREE!
