# Vercel Deployment - Quick Start

## ✅ What's Done

Your frontend is now configured for Vercel deployment. The code has been updated to use environment variables for the API base URL instead of hardcoding `localhost:5100`.

## 🚀 Deploy to Vercel in 3 Steps

### Step 1: Import GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub repository `URP_frontend`
5. Click **"Import"**

### Step 2: Add Environment Variable

1. Vercel will show you project settings
2. Go to **"Environment Variables"**
3. Add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://urp-backend-1.onrender.com`
   - **Environment**: Select "Production" (and "Preview" if desired)
4. Click **"Save"**

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Your app will be live at a Vercel URL like: `https://your-app.vercel.app`

## 📋 What Changed in Code

### New Files:

- `src/config/api.ts` - Centralized API configuration
- `.env.example` - Environment variable template
- `.env.production` - Production reference
- `vercel.json` - Vercel configuration
- `VERCEL_DEPLOYMENT_GUIDE.md` - Detailed guide
- `DEPLOYMENT_CONFIG_SUMMARY.md` - Full summary

### Updated Files:

- `src/app/App.tsx` - Updated API endpoints
- `src/app/components/workbench.tsx` - Updated API endpoints
- `src/app/components/profile-page.tsx` - Updated API endpoints

## 🔑 Environment Variable

Set this in Vercel dashboard:

```
VITE_API_BASE_URL=https://your-production-backend.com
```

Example values:

```
https://api.recruitment-portal.com
https://backend-api.herokuapp.com
https://api.yourdomain.com
https://your-backend-service.vercel.app
```

## ⚠️ Important

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Always set `VITE_API_BASE_URL`** in Vercel environment variables
3. **Backend URL must be HTTPS** (or at least accessible from Vercel)
4. **CORS must be configured** on your backend

## 🧪 Test Before Deployment

```bash
# Build locally
npm run build

# Test the build
npm run preview

# This will show your app as it would appear on Vercel
```

## 📚 More Information

- **Detailed Guide**: Read `VERCEL_DEPLOYMENT_GUIDE.md`
- **Complete Summary**: Read `DEPLOYMENT_CONFIG_SUMMARY.md`
- **API Configuration**: Check `src/config/api.ts`

## ❓ Common Issues

### API returns 404

→ Check your backend URL in environment variables

### Environment variables not working

→ Redeploy after setting environment variables

### CORS errors

→ Ensure backend allows requests from your Vercel domain

## 💡 Tips

1. **Preview Deployments**: Each GitHub branch gets a preview URL
2. **Environment-specific variables**: Set different URLs for Preview vs Production
3. **Custom Domain**: After deployment, add your custom domain in Vercel settings
4. **Auto-deployments**: Push to `main` branch for automatic deployments

## 🎉 You're Ready!

Your app is now ready to deploy. Push to GitHub and connect to Vercel!
