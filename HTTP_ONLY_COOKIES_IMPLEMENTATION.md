# HTTP-Only Cookies Authentication Implementation

## Overview

This document describes the persistent login implementation using HTTP-only cookies. The system no longer relies on localStorage for token storage, providing better security and automatic session persistence.

## Key Features

✅ **HTTP-Only Cookies**: Authentication tokens stored in HTTP-only cookies (inaccessible from JavaScript)
✅ **Persistent Sessions**: Users remain logged in after page refresh
✅ **Automatic Credentials**: Cookies sent automatically with all authenticated requests
✅ **React Context**: User state managed via AuthContext
✅ **Axios Integration**: Modern HTTP client with automatic cookie handling
✅ **Graceful Error Handling**: Automatic logout on 401 errors
✅ **Loading States**: App checks authentication status on mount

## Architecture

### 1. AuthContext (`src/app/context/AuthContext.tsx`)

Central authentication state management using React Context.

**Features:**
- Automatic session check on app load via `GET /me`
- User state management
- Login, Signup, and Logout handlers
- HTTP-only cookie support via axios

**Key Methods:**
```typescript
useAuth() // Hook to access auth state and functions
```

**Context Values:**
```typescript
{
  user: User | null,           // Current logged-in user
  isLoading: boolean,          // Loading state during auth checks
  isAuthenticated: boolean,    // Authentication status
  login(email, password),      // Login handler
  signup(data),                // Signup handler
  logout(),                    // Logout handler
  checkAuth(),                 // Manual auth check
}
```

### 2. Updated API Utilities

#### `src/app/utils/api.ts` (Modified)
- Converted to use axios with credentials
- Maintains backward compatibility with existing code
- Automatic HTTP-only cookie handling
- Converts fetch-style calls to axios format

#### `src/app/utils/axiosApi.ts` (New - Optional)
- Alternative axios-only API client
- For new code or components wanting explicit axios usage

### 3. App.tsx Integration

The main App component now:
1. Uses `useAuth()` hook to get authentication state
2. Shows loading screen while checking session
3. Handles login/signup via context methods
4. Updates routes based on authenticated user
5. Calls logout via context method

**Key Changes:**
```typescript
const { user, isLoading, isAuthenticated, login, signup, logout } = useAuth();

// Show loading screen while checking auth
if (isLoading) { /* loading UI */ }

// Redirect to login if not authenticated
if (!isAuthenticated) { /* show login/signup */ }
```

### 4. Main Entry Point (`src/main.tsx`)

Wrapped with `AuthContextProvider`:
```tsx
<AuthContextProvider>
  <App />
</AuthContextProvider>
```

## API Endpoints

### Required Backend Endpoints

#### `GET /me` (New - Required)
Checks if user is already authenticated via HTTP-only cookie.

**Request:**
```
GET /me
Credentials: include
```

**Response (Authenticated):**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "User Name",
    "role": "candidate|admin|review-admin|review-engineer"
  }
}
```

**Response (Not Authenticated):**
```json
HTTP 401 Unauthorized
```

#### `POST /api/users/signin`
User login endpoint (unchanged, now uses cookies).

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "User Name",
    "role": "candidate"
  }
}
```

**Cookie Response:** Backend should set HTTP-only cookie with session token
```
Set-Cookie: session=<token>; HttpOnly; Secure; SameSite=Strict
```

#### `POST /api/users/signup`
User registration endpoint (unchanged, now uses cookies).

**Response:** Same as signin

#### `POST /api/users/logout` (New - Required)
Clear HTTP-only cookie on backend.

**Request:**
```
POST /api/users/logout
Credentials: include
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Cookie Response:** Backend should clear session cookie
```
Set-Cookie: session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0
```

## Migration from localStorage

### Before (Old Implementation)
```typescript
// Old way - storing token in localStorage
localStorage.setItem("authToken", token);

// Old API calls included token manually
const headers = new Headers();
headers.set("Authorization", `Bearer ${localStorage.getItem("authToken")}`);
```

### After (New Implementation)
```typescript
// New way - no token management needed
const { user, login } = useAuth();

// Token is automatically sent via cookies
// No manual header setup required
```

## Usage Examples

### 1. Login Component
```typescript
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login, isLoading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Navigation handled by App.tsx
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (/* login form */);
}
```

### 2. Protected Component
```typescript
import { useAuth } from "../context/AuthContext";

export function ProtectedComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 3. API Calls (No Changes Needed)
```typescript
import { apiCall } from "../utils/api";

// Works the same as before, but cookies are sent automatically
const data = await apiCall<DataType>("/api/endpoint", {
  method: "POST",
  body: JSON.stringify({ /* data */ }),
});
```

## Session Persistence Flow

```
1. User visits app
   ↓
2. AuthContext checks GET /me
   ↓
3. Backend finds HTTP-only cookie
   ↓
4. Returns user data
   ↓
5. App loads with authenticated user
   ↓
6. Page refresh → Go to step 2 (session maintained)
```

## Security Improvements

1. **HTTP-Only Cookies**: Token cannot be accessed via JavaScript (XSS protection)
2. **No localStorage**: No risk of token leakage through storage
3. **Automatic Transmission**: Cookies sent by browser automatically with credentials
4. **SameSite Attribute**: Protects against CSRF attacks (backend responsibility)
5. **Secure Flag**: Cookies only sent over HTTPS (backend responsibility)

## Logout Flow

```
1. User clicks logout
   ↓
2. Frontend calls logout() from AuthContext
   ↓
3. Sends POST /api/users/logout (with cookie)
   ↓
4. Backend clears HTTP-only cookie
   ↓
5. Frontend clears user state
   ↓
6. Redirects to login page
```

## Backward Compatibility

The new `apiCall` function supports both old and new calling styles:

```typescript
// Old style (fetch-like) - still works
apiCall("/api/endpoint", {
  method: "POST",
  body: JSON.stringify({ data }),
});

// New style (axios-like) - also works
apiCall("/api/endpoint", {
  method: "POST",
  data: { data },
});
```

## Configuration

### Environment Variables

Update `.env` or `vite.config.ts` if needed:
```
VITE_API_BASE_URL=https://urp-backend-1.onrender.com
```

### Axios Instance Configuration

Located in `src/app/utils/api.ts`:
```typescript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Critical for cookie handling
  headers: {
    "Content-Type": "application/json",
  },
});
```

## Testing

### Manual Testing Checklist

- [ ] Fresh page load → Shows loading screen → Redirects to login if not authenticated
- [ ] Login with valid credentials → Sets HTTP-only cookie → Redirects to dashboard
- [ ] Refresh page after login → Session persists → No redirect to login
- [ ] Logout → Cookie cleared → Redirected to login
- [ ] Navigate to protected route without auth → Redirected to login
- [ ] Failed login → Shows error message
- [ ] Check Network tab → Cookie sent with each request
- [ ] Check Application tab → No "authToken" in localStorage

### Browser DevTools Verification

1. **Cookies Tab**: Should see session/auth cookie with HttpOnly flag
2. **Storage Tab**: Should NOT see "authToken" in localStorage
3. **Network Tab**: All auth-required requests should have Cookie header

## Troubleshooting

### Users Not Staying Logged In After Refresh
- Verify `GET /me` endpoint is implemented
- Check that HTTP-only cookie is being set correctly
- Ensure `withCredentials: true` is set in axios config

### Cookie Not Being Sent
- Check `withCredentials: true` in axios instance
- Verify CORS is configured with `credentials: 'include'`
- Ensure domain/port matches for cookie transmission

### Logout Not Working
- Verify `POST /api/users/logout` endpoint clears cookie
- Check that logout is clearing user state in context
- Ensure redirect to login happens after logout

## Future Enhancements

1. **Token Refresh**: Add automatic token refresh on expiry
2. **Remember Me**: Extend cookie expiration for "remember me" functionality
3. **Multi-Device Logout**: Add option to logout from all devices
4. **Session Timeout**: Show warning before automatic logout
5. **Rate Limiting**: Add per-endpoint rate limiting

## Files Modified/Created

### Created Files
- `src/app/context/AuthContext.tsx` - Auth state management
- `src/app/utils/axiosApi.ts` - Optional axios-only utilities

### Modified Files
- `src/main.tsx` - Wrapped with AuthContextProvider
- `src/app/App.tsx` - Uses AuthContext hooks instead of local state
- `src/app/utils/api.ts` - Converted to axios-based implementation

### No Changes Required (Backward Compatible)
- All component files using `apiCall` - work without modification
- All existing login/signup flows - work with context integration

## References

- [Axios Documentation](https://axios-http.com/)
- [React Context Documentation](https://react.dev/reference/react/useContext)
- [HTTP-Only Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#security)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
