# 🚀 GitHub Pages Deployment Guide

## Issue Fixed: Blank Page on GitHub Pages

**Problem:** Project was showing a blank page on GitHub Pages but works locally.

**Root Cause:** 
- GitHub Pages was set to deploy from `/docs` folder
- Vite builds to `dist/` folder
- Missing base path configuration for GitHub Pages

**Solution Implemented:**
✅ Added `base: '/Study-Flow/'` to `vite.config.ts`
✅ Created GitHub Actions workflow for automatic deployment
✅ Added `.nojekyll` file for proper GitHub Pages configuration

---

## What Was Changed

### 1. `vite.config.ts`
```typescript
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/Study-Flow/',  // ← Added: GitHub Pages base path
      server: { ... },
      build: {
        outDir: 'dist',
        emptyOutDir: true,
      },
      // ...
    };
});
```

### 2. `.github/workflows/deploy.yml` (New)
Automatic deployment workflow that:
- Triggers on push to `main` branch
- Installs dependencies
- Builds the project
- Deploys to GitHub Pages

### 3. `.nojekyll` (New)
Empty file that tells GitHub Pages to treat this as a static site (not Jekyll)

### 4. `README.md` (Updated)
Added GitHub Pages deployment section with troubleshooting guide

---

## Setup GitHub Actions Secrets

**IMPORTANT:** You must add your API key as a secret for GitHub Actions to work:

1. Go to your repository: https://github.com/bsse1613-eng/Study-Flow
2. Click **Settings** (top menu)
3. Go to **Secrets and variables → Actions** (left sidebar)
4. Click **New repository secret**
5. Add these secrets:
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** Your Gemini API key from https://aistudio.google.com/app/apikey

---

## Verify Deployment

### Step 1: Check GitHub Actions
1. Go to your repository
2. Click **Actions** tab
3. Look for "Deploy to GitHub Pages" workflow
4. Wait for green checkmark ✅

### Step 2: Check GitHub Pages Settings
1. Go to **Settings → Pages**
2. Verify:
   - Source: `Deploy from a branch`
   - Branch: `gh-pages` (should be auto-created)
   - Folder: `/ (root)`

### Step 3: Visit Your Live Site
- **URL:** https://bsse1613-eng.github.io/Study-Flow/
- Should show the StudyFlow UI (not blank!)

---

## Troubleshooting

### ❌ Still Showing Blank Page?

**Solution 1: Clear Cache**
```powershell
# Hard refresh in browser
# Windows: Ctrl + Shift + Delete
# Mac: Cmd + Shift + Delete
```

**Solution 2: Check Console Errors**
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for 404 errors or CORS errors
4. Check if assets are loading from `/Study-Flow/...`

**Solution 3: Re-trigger Deployment**
```bash
git commit --allow-empty -m "Trigger deployment"
git push origin main
# Wait 1-2 minutes for workflow to complete
```

**Solution 4: Check Workflow Logs**
1. Go to **Actions** tab in GitHub
2. Click "Deploy to GitHub Pages" workflow
3. Check logs for errors
4. Common error: Missing `VITE_GEMINI_API_KEY` secret

### ❌ API Key Error?

Add the secret to GitHub:
1. Settings → Secrets and variables → Actions
2. Add `VITE_GEMINI_API_KEY`
3. Re-run the workflow (or push new commit)

### ❌ Assets Not Loading?

1. Check URL bar - should show `/Study-Flow/...`
2. Open DevTools Console (F12)
3. Look for 404 errors
4. If assets show `404 /assets/...`, it means base path is wrong
5. Verify `base: '/Study-Flow/'` in `vite.config.ts`

---

## How It Works

```
┌─────────────────────────────────────────┐
│  You push to main branch                │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  GitHub Actions triggered               │
│  - Installs dependencies (npm ci)       │
│  - Builds project (npm run build)       │
│  - Creates dist/ folder                 │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  peaceiris/actions-gh-pages deploys     │
│  - Publishes dist/ to gh-pages branch   │
│  - GitHub Pages serves the site         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  Live at:                               │
│ https://bsse1613-eng.github.io/Study-  │
│           Flow/                         │
└─────────────────────────────────────────┘
```

---

## Local Testing

To test the production build locally before pushing:

```bash
# Build for production
npm run build

# Preview the build
npm run preview

# Visit http://localhost:4173
```

---

## Future Improvements

1. **Add Custom Domain:** 
   - Update `CNAME` file in workflow
   - Configure custom domain in GitHub Pages settings

2. **Enable HTTPS:**
   - Automatic with GitHub Pages
   - Add custom domain for better SSL

3. **Add Environment-Specific Builds:**
   - Separate workflows for staging/production
   - Different API keys per environment

---

## Quick Reference

| What | URL/Location |
|------|-------------|
| Live Site | https://bsse1613-eng.github.io/Study-Flow/ |
| GitHub Repo | https://github.com/bsse1613-eng/Study-Flow |
| Actions Tab | Settings → Actions → Secrets |
| Pages Settings | Settings → Pages |
| Workflow File | `.github/workflows/deploy.yml` |

---

## Summary

✅ **Your StudyFlow project is now automatically deployed to GitHub Pages!**

Every time you push to `main`, it will:
1. Automatically build the project
2. Deploy to GitHub Pages
3. Be live at https://bsse1613-eng.github.io/Study-Flow/

**Next Step:** 
- Verify your API key secret is set in GitHub
- Check Actions tab for successful deployment
- Visit your live site!

---

**Status:** 🟢 **DEPLOYMENT CONFIGURED**

Last Updated: November 29, 2025
