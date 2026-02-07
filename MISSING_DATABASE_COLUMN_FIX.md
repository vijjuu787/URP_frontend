# Missing Database Column - Fix Guide

## ❌ Error

```
The column `assignments.overview` does not exist in the current database.
```

## 🎯 Root Cause

Your Prisma schema expects an `overview` column in the `assignments` table, but the database doesn't have it.

This can happen because:

1. The migration file exists but wasn't applied to the database
2. The database was reset/recreated
3. The migration file is missing from the project

## 🔧 How to Fix (Backend Repository)

### Step 1: Check Your Prisma Schema

In your **backend repository** (`URP_BACKEND`), open:

```
prisma/schema.prisma
```

Find the `Assignment` model and check if it has `overview`:

```prisma
model Assignment {
  id          Int     @id @default(autoincrement())
  jobId       Int
  overview    String?  // ← This column
  // ... other fields
}
```

### Step 2: Fix the Schema (If Needed)

**Option A: If `overview` should exist**

- Keep it in the schema
- Run migrations (see Step 3)

**Option B: If `overview` is NOT needed**

- Remove `overview` from the Prisma schema
- Create a new migration:
  ```bash
  npx prisma migrate dev --name remove_overview_column
  ```
- This will remove the column expectation

### Step 3: Apply Database Migrations

**In your backend local environment:**

```bash
# Navigate to backend directory
cd URP_BACKEND

# Install dependencies if needed
npm install

# Apply all pending migrations
npx prisma migrate deploy

# Or create and apply migrations together
npx prisma migrate dev
```

### Step 4: Deploy to Render

After fixing locally:

```bash
# Push changes to GitHub
git add .
git commit -m "Fix: Update database schema - handle overview column"
git push origin main
```

**Render will auto-redeploy**, or manually redeploy from Render dashboard.

## 📊 Check Current Schema

To see what columns exist in your database:

```bash
# Using Prisma Studio (interactive)
npx prisma studio

# Or check directly in PostgreSQL
psql -U postgres -d your_database
\d assignments
```

## 🆘 If You Don't Know What To Do

### Quick Fix (Nuclear Option - Use Only if Stuck)

If the schema is inconsistent and you want to reset:

```bash
# WARNING: This deletes all data!
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Recreate it
# 3. Run all migrations
# 4. Seed with data (if seed.ts exists)
```

⚠️ **Only use this if you don't have production data!**

## ✅ Permanent Solution

1. **Fix the Prisma schema** to match your database
2. **Create/apply migrations** to sync database
3. **Push to GitHub**
4. **Render auto-deploys**
5. **Frontend works again**

## 📋 Migration File Example

Your migration might look like:

```
prisma/migrations/[timestamp]_init/migration.sql
```

Should contain:

```sql
-- assignments table
CREATE TABLE "Assignment" (
  id SERIAL PRIMARY KEY,
  "jobId" INTEGER NOT NULL,
  overview TEXT,
  -- ... other columns
);
```

## 🔍 Debugging Steps

1. **Check Prisma schema**: Does it match your database?
2. **Check migrations folder**: `prisma/migrations/`
3. **Run migrations**: `npx prisma migrate deploy`
4. **Check database**: Use `psql` or Prisma Studio
5. **Redeploy**: Push to GitHub, Render auto-deploys

## 📝 Common Solutions

| Issue                                | Solution                              |
| ------------------------------------ | ------------------------------------- |
| Schema has `overview` but DB doesn't | Run `npx prisma migrate deploy`       |
| DB has `overview` but schema doesn't | Add to Prisma schema + migrate        |
| Mismatch in local vs production      | Reset with `npx prisma migrate reset` |
| Don't know what's in the DB          | Use `npx prisma studio`               |

## 🚀 Steps (In Order)

1. **Open your URP_BACKEND repository** on your local machine
2. **Check `prisma/schema.prisma`** - look at Assignment model
3. **Run `npx prisma migrate deploy`** to apply pending migrations
4. **Test locally**: `npm start` should work without DB errors
5. **Push to GitHub**: Git commit and push
6. **Render auto-deploys**: Wait 2-5 minutes
7. **Frontend should work**: Refresh your Vercel app

## 💡 What's Happening Now

```
Frontend → API Call
         ↓
Backend → Prisma Query
        ↓
        Expects: assignments.overview column
        ↓
Database: Column doesn't exist!
        ↓
Error: 500 Internal Server Error
```

**Once you add the column to the database, it will work!**

---

**This is a backend-only issue.**  
**Fix it in your URP_BACKEND repository, not in the frontend.**
