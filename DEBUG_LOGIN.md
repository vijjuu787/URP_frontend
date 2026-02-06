# Login Flow Debugging Guide

## Console Logs to Check

When you click the Sign In button, you should see these logs in the browser console (in order):

1. **In LoginPage component:**

   ```
   handleSubmit called with { email: "...", password: "..." }
   Calling onLogin...
   ```

2. **In App.tsx handleLogin function:**
   ```
   handleLogin called with: { email: "...", password: "..." }
   API response: { message: "...", token: "...", user: {...} }
   Storing token: eyJ...
   Setting user: { email: "...", name: "...", role: "..." }
   Routing to [onboarding/jobs/dashboard]
   onLogin succeeded
   ```

## If onLogin is NOT being called:

1. Check browser console for "Calling onLogin..." message
2. If missing, the issue is in LoginPage's handleSubmit
3. Verify the form submission is working (check for "handleSubmit called with...")

## If onLogin is called but fails:

1. Check for "API response:" log
2. If missing, the API call failed
3. Check the "Login error:" log for the error message
4. Look for network errors in Network tab of DevTools

## Common Issues:

- **Backend not running:** Make sure `http://localhost:5100` is accessible
- **Invalid credentials:** API returns 401 error
- **CORS issues:** Check browser console for CORS errors
- **Token not stored:** Check Application tab → LocalStorage for "authToken"

## Testing Quick Login:

Try clicking the "Candidate" quick login button first, which uses:

- Email: `sarah.johnson@email.com`
- Password: `candidate123`

If this doesn't work, the backend connection is the issue.
