# 500 Internal Server Error - Backend Troubleshooting

## ❌ Error Details

```
GET https://urp-backend-1.onrender.com/api/assignments/job/1 500 (Internal Server Error)
```

This means:

- ✅ Frontend is correctly making the API call
- ✅ Backend received the request
- ❌ Backend encountered an error processing it

## 🔍 Root Causes (Most Common)

1. **Database Connection Issue**
   - PostgreSQL database not connected
   - Invalid connection string
   - Database is down/inaccessible

2. **Missing Environment Variables**
   - `DATABASE_URL` not set
   - Missing API keys or secrets
   - Render environment variables not configured

3. **Database Migration Issues**
   - Prisma migrations not run
   - Schema mismatch
   - Missing tables

4. **Code Error**
   - Bug in the API endpoint
   - Invalid query in Prisma
   - Runtime error in Node.js

## 🔧 How to Fix

### Step 1: Check Render Backend Logs

1. Go to [render.com](https://render.com)
2. Click on your **URP_BACKEND** service
3. Go to **"Logs"** tab
4. Look for error messages near the timestamp of the request
5. The error will tell you exactly what's wrong

### Step 2: Common Fixes

#### A. Database Connection Error

**Symptom**: Logs show "ECONNREFUSED" or "DATABASE_URL"

**Fix**:

1. Go to Render Dashboard
2. Click **URP_BACKEND** service
3. Go to **Environment** tab
4. Check `DATABASE_URL` is set correctly
5. Format should be: `postgresql://user:password@host:port/database`

#### B. Prisma Migration Not Run

**Symptom**: Logs show "table does not exist"

**Fix**:

1. Add to Render **Build Command**:
   ```bash
   npm install && npx prisma migrate deploy
   ```
2. Or manually run migrations in Render shell

#### C. Missing Assignments Table

**Symptom**: Error about "assignments" table not found

**Fix**:

1. Check `src/backend/prisma/schema.prisma` has Assignment model
2. Run: `npx prisma migrate deploy`
3. Redeploy service

### Step 3: Check Prisma Schema

Ensure your Prisma schema has the `Assignment` model:

```prisma
model Assignment {
  id        Int     @id @default(autoincrement())
  jobId     Int
  job       Job     @relation(fields: [jobId], references: [id])

  // other fields...
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Step 4: Verify Backend Endpoint

In your backend code, ensure the endpoint exists:

```typescript
// backend/routes/assignment.ts (or similar)
router.get("/assignments/job/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    const assignment = await prisma.assignment.findUnique({
      where: { jobId: parseInt(jobId) },
      // include other relations
    });

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
```

## 📊 Request Path

```
Frontend (Vercel)
        ↓
Makes GET request to:
https://urp-backend-1.onrender.com/api/assignments/job/1
        ↓
Backend (Render)
        ↓
Route: /api/assignments/job/:jobId
        ↓
Query: SELECT * FROM assignments WHERE jobId = 1
        ↓
Database (PostgreSQL)
        ↓
Response: Error or Data
```

## 🆘 If Still Getting 500 Error

### Quick Diagnostic Checklist

- [ ] Check Render logs (most important!)
- [ ] Verify DATABASE_URL is set in Render
- [ ] Run `npx prisma migrate deploy`
- [ ] Ensure Assignment table exists in database
- [ ] Check endpoint path is correct
- [ ] Verify job with ID 1 exists in database

### Check Database Directly

If you have access to your PostgreSQL database:

```sql
-- Check if assignments table exists
\dt assignments

-- Check if there's an assignment for job_id 1
SELECT * FROM "Assignment" WHERE "jobId" = 1;

-- If needed, run Prisma migrations
-- npx prisma migrate deploy
```

### Test Endpoint Manually

```bash
# Test the endpoint locally first
curl -X GET http://localhost:5100/api/assignments/job/1

# Or test production
curl -X GET https://urp-backend-1.onrender.com/api/assignments/job/1
```

## 📞 Render Support Resources

- Render Logs: https://render.com/docs/logging
- Database Issues: https://render.com/docs/databases
- Troubleshooting: https://render.com/docs/troubleshooting-deploys

## 🎯 Next Steps

1. **Check Render Logs** ← DO THIS FIRST
2. Identify the exact error
3. Apply the appropriate fix
4. Redeploy backend
5. Test again

## 💡 Most Likely Issue

Based on common 500 errors on Render:

- **70%**: DATABASE_URL not set or invalid
- **20%**: Prisma migrations not run
- **10%**: Code bug or missing endpoint

**Check your Render logs first!** They will tell you exactly what's wrong.

---

**Once you fix the backend error, the frontend will work perfectly!**
