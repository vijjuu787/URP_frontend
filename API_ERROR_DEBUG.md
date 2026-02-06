# API Error Debugging Guide

## Problem: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

This error occurs when the API endpoint returns HTML instead of JSON. Common causes:

### 1. **Endpoint doesn't exist (404)**

- The backend server is running but the `/api/skills` endpoint is not implemented
- Check the backend server console for route registration

### 2. **Server error (500)**

- The backend encountered an error processing the request
- Check backend logs for detailed error messages

### 3. **Authentication failure (401)**

- The Bearer token is invalid or missing
- Verify the token is being sent correctly

### 4. **Backend not running**

- The server at `http://localhost:5100` is not accessible
- Check if the backend server is running

## How to Debug (Console Logs)

Now the API utility logs detailed information. Open browser DevTools (F12) and check Console:

### Success flow:

```
[API] Making POST request to: http://localhost:5100/api/skills
[API] Response status: 201 Created
[API] Response data: { id: "...", userId: "...", ... }
Saving skills...
Form data: { currentRole: "...", ... }
Selected skills: [ { name: "...", proficiency: "..." }, ... ]
Sending request body: { primaryRole: "...", ... }
Skills saved successfully: { id: "...", userId: "...", ... }
```

### Error flow:

```
[API] Making POST request to: http://localhost:5100/api/skills
[API] Response status: 404 Not Found
[API] Non-JSON error response: <!DOCTYPE html>...
Error saving skills: HTTP 404: Not Found
```

## Checklist

- [ ] Backend server is running (`npm start` or `pnpm dev`)
- [ ] Backend is listening on `http://localhost:5100`
- [ ] `/api/skills` endpoint exists in backend
- [ ] Endpoint expects POST method
- [ ] Endpoint has `requireAuth` middleware
- [ ] User is logged in (token in localStorage)
- [ ] Request body format matches API expectations
- [ ] Backend middleware returns JSON errors (not HTML)

## Common Backend Issues

### Missing requireAuth middleware

```javascript
// ❌ Wrong - no auth check
router.post("/skills", async (req, res) => { ... })

// ✅ Correct
router.post("/skills", requireAuth, async (req, res) => { ... })
```

### Invalid error response format

```javascript
// ❌ Wrong - backend returns HTML
res.status(500).send("<html>Error</html>");

// ✅ Correct
res.status(500).json({ error: "Database error" });
```

### Missing Content-Type header

```javascript
// ❌ Wrong - returns HTML
res.send({ data: "..." });

// ✅ Correct
res.json({ data: "..." });
```

## API Request Format

The onboarding form sends:

```json
{
  "primaryRole": "Backend Engineer",
  "secondaryRole": "DevOps Engineer",
  "experienceLevel": "5",
  "skill": "JavaScript, TypeScript, Node.js, Docker",
  "workType": "Remote",
  "jobType": "Full-time",
  "experienceAndProject": "Built microservices..."
}
```

All fields should be strings. Make sure the backend expects and validates these fields.
