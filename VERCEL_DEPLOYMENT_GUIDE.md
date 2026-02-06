# Vercel Deployment Guide

## Overview
This frontend application is now configured for Vercel deployment with environment-based API URL configuration.

## Setup Steps

### 1. **Add Environment Variable to Vercel**
   - Go to your Vercel project dashboard
   - Navigate to **Settings → Environment Variables**
   - Add the following environment variable:
     ```
     VITE_API_BASE_URL=https://your-backend-api.com
     ```
   - Replace `https://your-backend-api.com` with your actual production backend URL

### 2. **How It Works**
   - The application reads the `VITE_API_BASE_URL` from environment variables
   - Defined in `src/config/api.ts`: `export const API_BASE_URL = ...`
   - All API calls throughout the app use this base URL
   - Local development uses `http://localhost:5100` from `.env.local`

### 3. **Files Changed**
   - **`.env.local`**: Local development environment variables
   - **`.env.production`**: Production environment variables (reference)
   - **`.env.example`**: Template for environment variables
   - **`vercel.json`**: Vercel configuration file
   - **`src/config/api.ts`**: Centralized API base URL configuration
   - **`src/vite-env.d.ts`**: TypeScript definitions for Vite environment variables
   - **Updated components**:
     - `src/app/App.tsx`: Updated all API calls to use `API_BASE_URL`
     - `src/app/components/workbench.tsx`: Updated download and submission endpoints

### 4. **Deployment Steps**

#### Via Vercel CLI:
```bash
npm install -g vercel
vercel deploy
```

#### Via GitHub (Recommended):
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect it's a Vite project
6. Add environment variables in project settings
7. Click "Deploy"

### 5. **Environment Variables Setup in Vercel**

#### In Vercel Dashboard:
1. Go to **Project Settings** → **Environment Variables**
2. Add variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://urp-backend-1.onrender.com`
   - **Environment**: Select which environment (Production, Preview, Development)

#### Your Backend URL:
```
https://urp-backend-1.onrender.com
```

### 6. **Local Development**
Ensure `.env.local` is in your root directory:
```
VITE_API_BASE_URL=https://urp-backend-1.onrender.com
```

### 7. **Testing Before Deployment**
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run locally to test production build
npm run preview
```

### 8. **Troubleshooting**

#### API Calls Return 404/CORS Errors
- Verify `VITE_API_BASE_URL` is set correctly in Vercel environment variables
- Check backend server is running and accessible from Vercel

#### Environment Variables Not Loaded
- Make sure to redeploy after adding environment variables in Vercel
- Clear browser cache and reload

#### CORS Issues
- Ensure backend has proper CORS headers configured
- Allow requests from your Vercel domain

### 9. **Deployment Checklist**
- [ ] Backend API is deployed and running
- [ ] Backend URL is added to Vercel environment variables
- [ ] All API calls use `API_BASE_URL` from config
- [ ] `.env.local` is in `.gitignore` (never commit local secrets)
- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors: `npm run build`
- [ ] GitHub repository is connected to Vercel
- [ ] Environment variables are set in Vercel dashboard

### 10. **After Deployment**
- Test all API endpoints work correctly
- Monitor Vercel logs for any errors
- Check application performance
- Set up error monitoring (e.g., Sentry)

## File Reference

### `src/config/api.ts`
Central place to define your API base URL:
```typescript
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5100';
```

### Usage in Components
```typescript
import { API_BASE_URL } from "../config/api";

// In your fetch calls:
const response = await fetch(`${API_BASE_URL}/api/endpoint`);
```

## Additional Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Deployment on Vercel](https://vercel.com/guides/deploying-react-with-vercel)
