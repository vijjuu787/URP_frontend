# ProfilePage - Troubleshooting Guide

## Common Issues & Solutions

---

## ❌ Error: "Unable to Load Profile - No token"

### What This Means

The ProfilePage is trying to fetch user profile data from the backend API, but no authentication token is found in localStorage.

### Root Cause

- User is not logged in
- Session has expired
- Token was cleared from localStorage
- Browser's localStorage is disabled

### Solution

✅ **Log In First**

1. Navigate to the login page
2. Enter your email and password
3. Click "Sign In"
4. After successful login, you'll be redirected and a token will be saved
5. Then try accessing the profile page again

### Technical Details

```
API Endpoint: GET http://localhost:5100/api/profile
Status Code: 401 Unauthorized
Error: "No token"
Expected: Authorization header with Bearer token
```

---

## ❌ Error: "Unable to Load Profile - Failed to fetch profile"

### What This Means

The backend API is not responding correctly. This could be due to:

- Backend server is not running
- Network connection issue
- API endpoint is incorrectly configured
- CORS policy issue

### Solution

**Step 1: Verify Backend Server is Running**

```bash
# Check if backend is running on port 5100
curl http://localhost:5100/api/profile

# You should get a 401 (because no token) not a connection error
```

**Step 2: Check Network Tab**

- Open DevTools (F12)
- Go to Network tab
- Refresh the page
- Look for the GET request to `http://localhost:5100/api/profile`
- Check the response and error details

**Step 3: Verify API Configuration**
In `profile-page.tsx`:

```typescript
const response = await fetch("http://localhost:5100/api/profile", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
```

**Step 4: Check Console Logs**
Open browser console and look for:

```
Fetching from: http://localhost:5100/api/profile
Response status: [status code]
Response data: [data or error]
```

---

## ❌ Error: "Unable to Load Profile - Backend server is unreachable"

### What This Means

The frontend cannot connect to the backend at all.

### Solutions

**1. Start Backend Server**

```bash
cd backend
npm install
npm start
# Should be running on http://localhost:5100
```

**2. Verify Port 5100**

```bash
# Check if port 5100 is in use
lsof -i :5100

# Kill process on port 5100 if needed
kill -9 [PID]
```

**3. Check Environment Variables**
Make sure backend has:

- DATABASE_URL set correctly
- PORT set to 5100
- CORS enabled for frontend origin

---

## ✅ Error: "Profile not found (404)"

### What This Means

User is logged in (token is valid) but their profile hasn't been created yet.

### Solution

This is expected! The component displays a message:

```
"No profile data available yet"
```

**To Create a Profile:**

### Option 1: Upload Resume During Signup

1. Go to SignupPage
2. Create a new account
3. Upload a resume file (PDF/DOC)
4. Submit signup
5. Profile will be auto-populated from resume

### Option 2: Edit Profile Manually

1. Log in to your account
2. Go to ProfilePage
3. Click "Edit Profile"
4. Fill in your information:
   - Headline
   - Summary
   - Location
   - Phone
   - Skills
   - Experience
   - Education
5. Click "Save"

### Option 3: Use Backend API Directly

```bash
curl -X POST http://localhost:5100/api/profile \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "headline": "Senior Developer",
    "summary": "Experienced developer...",
    "location": "San Francisco, CA",
    "phone": "+1 (555) 123-4567",
    "experiences": [],
    "educations": [],
    "skills": {
      "frontend": ["React", "TypeScript"],
      "backend": ["Node.js"],
      "tools": ["Docker"]
    }
  }'
```

---

## 🔍 Debugging Checklist

- [ ] Token exists in localStorage

  ```javascript
  // In browser console:
  localStorage.getItem("token");
  ```

- [ ] Backend is running on port 5100

  ```bash
  curl http://localhost:5100/health
  ```

- [ ] API endpoint is correct
  - URL: `http://localhost:5100/api/profile`
  - Method: `GET`
  - Header: `Authorization: Bearer [token]`

- [ ] Profile has been created for the user
  - Check database: `SELECT * FROM user_profiles WHERE userId = '[userId]'`
  - Or use API: POST to `/api/profile` with profile data

- [ ] CORS is enabled on backend
  - Backend should allow requests from `http://localhost:5173` (or your frontend URL)

- [ ] Browser console shows no errors
  - Open DevTools (F12)
  - Check Console tab
  - Look for red error messages

---

## 📊 Expected API Responses

### Success (200)

```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "headline": "Senior Developer",
    "summary": "...",
    "location": "San Francisco, CA",
    "phone": "+1 (555) 123-4567",
    "experiences": [
      {
        "id": "uuid",
        "company": "TechCorp",
        "role": "Senior Developer",
        "startDate": "Jan 2023",
        "endDate": "Present",
        "description": "..."
      }
    ],
    "educations": [
      {
        "id": "uuid",
        "degree": "BS Computer Science",
        "institution": "UC Berkeley",
        "graduationYear": "2016"
      }
    ],
    "skills": {
      "frontend": ["React", "TypeScript"],
      "backend": ["Node.js"],
      "tools": ["Docker"]
    }
  }
}
```

### Not Found (404)

```json
{
  "error": "Profile not found"
}
```

### Unauthorized (401)

```json
{
  "error": "No token"
}
```

### Server Error (500)

```json
{
  "error": "Internal server error"
}
```

---

## 🛠️ Code Flow

```
ProfilePage Component
    ↓
useEffect Hook (on mount)
    ↓
Get token from localStorage
    ↓
Fetch GET /api/profile
    ↓
Check Response Status
    ├─ 200 OK → Set profileData → Render profile
    ├─ 404 Not Found → Show "No profile yet" → Offer to edit
    ├─ 401 Unauthorized → Show "Please Log In" button
    └─ Other Error → Show error message → Offer retry
```

---

## 📝 Implementation Details

### State Variables

```typescript
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [profileData, setProfileData] = useState<ProfileData | null>(null);
```

### Error States Handled

1. **401 Unauthorized** → "Please Log In"
2. **404 Not Found** → "No profile data" (empty state)
3. **Network Error** → "Failed to connect to backend"
4. **JSON Parse Error** → "Invalid response format"
5. **Other Errors** → "Unable to load profile"

### Features

- ✅ Loading state with spinner
- ✅ Error messages with action buttons
- ✅ Auto-retry on button click
- ✅ Redirect to login for unauthorized
- ✅ Handle empty profiles gracefully
- ✅ Console logging for debugging

---

## 🚀 Quick Fix Steps

1. **"No token" error?**
   - Click "Go to Login" button
   - Log in with your credentials
   - Come back to profile

2. **Backend connection error?**
   - Ensure backend is running: `npm run dev` in backend folder
   - Check it's on port 5100
   - Refresh the page

3. **"Profile not found"?**
   - Click "Edit Profile"
   - Fill in your information
   - Click "Save"

4. **Still having issues?**
   - Open DevTools (F12)
   - Check Network tab for API response
   - Check Console tab for error messages
   - Share the error messages in the console

---

## 📞 Support

### Check These Resources

- See API response in Network tab → tells you what went wrong
- Check browser console → shows error stack trace
- Look at backend logs → shows server-side issues
- Review this troubleshooting guide → covers common issues

### Debugging Tips

```javascript
// Check if logged in
console.log(localStorage.getItem("token"));

// Check if profile endpoint works
fetch("http://localhost:5100/api/profile", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})
  .then((r) => r.json())
  .then(console.log);

// Check component state
console.log("isLoading:", isLoading);
console.log("error:", error);
console.log("profileData:", profileData);
```

---

**Status**: All error cases handled ✅
**Last Updated**: February 6, 2026
**Component**: ProfilePage
**API**: GET /api/profile (port 5100)
