# Backend Integration Guide: HTTP-Only Cookies Implementation

## Overview

This guide explains what changes the backend needs to support the new persistent login system using HTTP-only cookies.

## Required Changes to Backend

### 1. New Endpoint: `GET /me`

**Purpose**: Check if user is already authenticated via HTTP-only cookie

**Implementation Requirements**:
- Must check if valid session cookie exists
- Must return user data if authenticated
- Must return 401 if not authenticated
- Must support CORS with credentials

**Example Response (Authenticated)**:
```json
HTTP 200 OK

{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "candidate"
  }
}
```

**Example Response (Not Authenticated)**:
```json
HTTP 401 Unauthorized

{
  "error": "Not authenticated"
}
```

### 2. Update: `POST /api/users/signin`

**Changes Needed**:
- Continue accepting email and password
- Remove returning token in response body (not needed anymore)
- Set HTTP-only cookie instead

**Before**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "candidate"
  }
}
```

**After**:
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "candidate"
  }
}
```

**Cookie Setting** (HTTP response header):
```
Set-Cookie: session=<jwt-token>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800
```

**Parameters Explanation**:
- `HttpOnly`: Prevents JavaScript from accessing the cookie
- `Secure`: Only sent over HTTPS (production)
- `SameSite=Strict`: Prevents CSRF attacks
- `Path=/`: Available for entire site
- `Max-Age=604800`: Expires in 7 days

### 3. Update: `POST /api/users/signup`

**Changes Needed**:
- Same as signin - set HTTP-only cookie instead of returning token
- Remove token from response

### 4. New Endpoint: `POST /api/users/logout`

**Purpose**: Clear the HTTP-only session cookie

**Implementation**:
```javascript
// Express example
app.post('/api/users/logout', (req, res) => {
  // Clear the session cookie
  res.clearCookie('session', { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'strict',
    path: '/'
  });
  
  res.json({ message: 'Logged out successfully' });
});
```

**Response**:
```json
HTTP 200 OK

{
  "message": "Logged out successfully"
}
```

## Cookie Configuration Best Practices

### Development (localhost)
```
Set-Cookie: session=<token>; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800
```
(Remove `Secure` flag for localhost HTTP)

### Production
```
Set-Cookie: session=<token>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800
```

## CORS Configuration

**Important**: Backend must support credentials in CORS

### Express.js Example
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://your-frontend-domain.com', // Specific domain
  credentials: true // Allow cookies
}));
```

### Node/Express Full Example
```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// GET /me - Check authentication
app.get('/me', (req, res) => {
  const token = req.cookies.session;
  
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch user from database
    const user = getUserById(decoded.userId);
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /api/users/signin
app.post('/api/users/signin', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate credentials
  const user = await User.findOne({ email });
  if (!user || !user.validatePassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create JWT token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Set HTTP-only cookie
  res.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.name,
      role: user.role
    }
  });
});

// POST /api/users/logout
app.post('/api/users/logout', (req, res) => {
  res.clearCookie('session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  
  res.json({ message: 'Logged out successfully' });
});
```

## Python/Flask Example

```python
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from functools import wraps
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, supports_credentials=True)

def set_auth_cookie(response, token):
    """Helper to set HTTP-only cookie"""
    response.set_cookie(
        'session',
        token,
        httponly=True,
        secure=True,  # Set to False for localhost
        samesite='Strict',
        path='/',
        max_age=7 * 24 * 60 * 60  # 7 days
    )
    return response

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'Not authenticated'}), 401
        
        try:
            decoded = jwt.decode(token, app.config['JWT_SECRET'], algorithms=['HS256'])
            request.user_id = decoded['user_id']
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

@app.route('/me', methods=['GET'])
@require_auth
def get_current_user():
    user = User.query.get(request.user_id)
    return jsonify({
        'user': {
            'id': user.id,
            'email': user.email,
            'fullName': user.name,
            'role': user.role
        }
    })

@app.route('/api/users/signin', methods=['POST'])
def signin():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = jwt.encode(
        {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=7)
        },
        app.config['JWT_SECRET'],
        algorithm='HS256'
    )
    
    response = make_response(jsonify({
        'user': {
            'id': user.id,
            'email': user.email,
            'fullName': user.name,
            'role': user.role
        }
    }))
    
    return set_auth_cookie(response, token)

@app.route('/api/users/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'message': 'Logged out successfully'}))
    response.delete_cookie('session', path='/')
    return response
```

## Testing the Implementation

### 1. Test GET /me (Not Authenticated)
```bash
curl -X GET http://localhost:5000/me \
  -H "Content-Type: application/json"
  
# Expected: 401 Unauthorized
```

### 2. Test Login (Sets Cookie)
```bash
curl -X POST http://localhost:5000/api/users/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt  # Save cookies
  
# Response should include Set-Cookie header
```

### 3. Test GET /me (With Cookie)
```bash
curl -X GET http://localhost:5000/me \
  -H "Content-Type: application/json" \
  -b cookies.txt  # Send cookies
  
# Expected: 200 OK with user data
```

### 4. Test Logout (Clears Cookie)
```bash
curl -X POST http://localhost:5000/api/users/logout \
  -H "Content-Type: application/json" \
  -b cookies.txt
  
# Expected: Set-Cookie with Max-Age=0
```

## Migration Checklist

- [ ] Implement `GET /me` endpoint
- [ ] Update `POST /api/users/signin` to set HTTP-only cookie
- [ ] Update `POST /api/users/signup` to set HTTP-only cookie
- [ ] Implement `POST /api/users/logout` endpoint
- [ ] Update CORS configuration to allow credentials
- [ ] Test all endpoints with credentials
- [ ] Update environment variables for cookie security flags
- [ ] Remove token from response bodies (only in cookies now)
- [ ] Test with frontend on different domain/port
- [ ] Document cookie settings in deployment guides

## Frontend Changes (Already Done)

The frontend has been updated to:
- Use AuthContext for authentication state
- Call `GET /me` on app load
- Remove localStorage dependency for tokens
- Use axios with `withCredentials: true`
- Handle 401 responses with logout

## Common Issues and Solutions

### Issue: Cookies not being sent
**Solution**: Ensure CORS has `credentials: true` and frontend uses `withCredentials: true`

### Issue: 401 after page refresh
**Solution**: Make sure `GET /me` endpoint is implemented and cookie is set correctly

### Issue: Logout not working
**Solution**: Verify `POST /api/users/logout` uses `clearCookie` with exact same options as `set_cookie`

### Issue: CORS errors
**Solution**: Set specific origin instead of wildcard, enable credentials, and add preflight handling

## References

- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Express Cookies](https://expressjs.com/en/resources/middleware/cookie-parser.html)
- [Flask CORS](https://flask-cors.readthedocs.io/)
