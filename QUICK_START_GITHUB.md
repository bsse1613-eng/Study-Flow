# 🎯 5-Minute GitHub Pages Setup

## The Problem ❌
Your StudyFlow project shows blank on GitHub Pages but works locally.

## The Root Cause 🔍
GitHub Pages was set to deploy from wrong folder with wrong configuration.

## The Solution ✅
All done! Just 2 simple steps to make it live...

---

## ⏱️ 5-Minute Setup

### Step 1: Add API Secret (2 minutes)

1. **Open this link:**
   ```
   https://github.com/bsse1613-eng/Study-Flow/settings/secrets/actions
   ```

2. **Click:** "New repository secret"

3. **Fill in:**
   - Name: `VITE_GEMINI_API_KEY`
   - Value: [paste your API key from https://aistudio.google.com/app/apikey]

4. **Click:** "Add secret"

✅ **Done!**

---

### Step 2: Watch Deployment (3 minutes)

1. **Open this link:**
   ```
   https://github.com/bsse1613-eng/Study-Flow/actions
   ```

2. **Wait for** "Deploy to GitHub Pages" workflow to complete

3. **Should see:** Green checkmark ✅

4. **Then visit:**
   ```
   https://bsse1613-eng.github.io/Study-Flow/
   ```

✅ **Live! 🎉**

---

## What Actually Changed?

| Issue | Fix |
|-------|-----|
| Blank page | Added base path `/Study-Flow/` |
| Wrong folder | Updated deploy to use `dist/` |
| No CI/CD | Added GitHub Actions workflow |
| Manual deploy | Now automatic on every push |

---

## Visual Workflow

```
Your Code
    ↓
git push origin main
    ↓
GitHub detects push
    ↓
GitHub Actions runs:
  ├─ npm install
  ├─ npm run build
  └─ Creates dist/ folder
    ↓
Deploys dist/ to GitHub Pages
    ↓
Your Site is LIVE! 🚀
    ↓
https://bsse1613-eng.github.io/Study-Flow/
```

---

## 🎓 What Happens Next?

**Every time you push to main:**
1. ✅ GitHub automatically builds your project
2. ✅ Deploys to GitHub Pages
3. ✅ Live instantly

**No more manual steps needed!**

---

## ❌ If Still Blank?

1. **Did you add the API secret?**
   - Go to Settings → Secrets → Add it

2. **Is the workflow green?**
   - Check Actions tab
   - If red, click workflow to see error

3. **Clear browser cache**
   - Ctrl+Shift+Delete (Windows)
   - Select "Cached images and files"
   - Delete

4. **Check browser console**
   - Press F12
   - Go to Console tab
   - Look for red errors

---

## Files Changed

✅ `vite.config.ts` - Added base path
✅ `.github/workflows/deploy.yml` - Auto deploy on push
✅ `.nojekyll` - GitHub Pages config
✅ `README.md` - Updated docs

All already pushed to GitHub!

---

## One More Thing...

### Current URL
```
https://bsse1613-eng.github.io/Study-Flow/
```

### Optional: Custom Domain
Want yourdomain.com instead? 
1. Buy a domain
2. Update GitHub Pages DNS
3. Update vite.config.ts base path

(Can do later!)

---

## Success Checklist

- [ ] Added `VITE_GEMINI_API_KEY` secret
- [ ] Workflow shows green checkmark ✅
- [ ] Site loads at GitHub Pages URL
- [ ] StudyFlow UI visible (not blank)
- [ ] Can use AI features

---

## 🎉 You're Done!

Your project is now live on GitHub Pages with automatic deployment!

**Try it:** https://bsse1613-eng.github.io/Study-Flow/

---

**For more details:** See [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md)  
**For full checklist:** See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

Created: November 29, 2025
