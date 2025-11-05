# 🔍 URL Configuration Summary - SocietyConnect

## ✅ Current Configuration (Verified)

### Backend API
- **Port**: 5000
- **URL**: `http://localhost:5000`
- **Configuration File**: `/backend/.env`
- **Entry Point**: `/backend/server.js`

### Frontend Application
- **Port**: 5173 (Vite default)
- **URL**: `http://localhost:5173`
- **Configuration Files**:
  - `/frontend/vite.config.js` - Port configuration
  - `/frontend/.env` - API base URL

### CORS Configuration
- **File**: `/backend/server.js`
- **Allowed Origins**: `http://localhost:5173`
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization
- **Credentials**: true

## 📡 API Endpoints & Usage

### Axios Configuration
**File**: `/frontend/src/api/axios.js`
```javascript
baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
```
✅ Fallback correctly set to port 5000

### Frontend Pages Making API Calls

#### 1. Login Page (`/frontend/src/pages/Login.jsx`)
- **API Call**: `axios.post('/api/auth/login', formData)`
- **Full URL**: `http://localhost:5000/api/auth/login`
- **Method**: POST
- **Purpose**: User authentication

#### 2. Signup Page (`/frontend/src/pages/Signup.jsx`)
- **API Call**: `axios.post('/api/auth/signup', formData)`
- **Full URL**: `http://localhost:5000/api/auth/signup`
- **Method**: POST
- **Purpose**: User registration

#### 3. Dashboard Page (`/frontend/src/pages/Dashboard.jsx`)
- **API Call**: `axios.get('/api/complaints')`
- **Full URL**: `http://localhost:5000/api/complaints`
- **Method**: GET
- **Purpose**: Fetch complaints data

## 🔧 Changes Made

### Fixed Issues:
1. ✅ **axios.js fallback URL**: Changed from `localhost:3000` → `localhost:5000`
2. ✅ **Backend PORT**: Changed from `3000` → `5000` in `.env`
3. ✅ **CORS Configuration**: Updated to allow `localhost:5173`
4. ✅ **React Router Warnings**: Added future flags

## 🌐 URL Architecture

```
┌─────────────────────────────────────────────┐
│  Browser: http://localhost:5173             │
│  (React Frontend - Vite Dev Server)         │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTP Requests
                   │ (with JWT in Authorization header)
                   ▼
┌─────────────────────────────────────────────┐
│  API: http://localhost:5000                 │
│  (Node.js + Express Backend)                │
└──────────────────┬──────────────────────────┘
                   │
                   │ Database Queries
                   ▼
┌─────────────────────────────────────────────┐
│  MongoDB Atlas                              │
│  (Cloud Database)                           │
└─────────────────────────────────────────────┘
```

## 📝 Environment Variables

### Backend (`/backend/.env`)
```properties
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
PORT=5000  ✅ Correct
```

### Frontend (`/frontend/.env`)
```properties
VITE_API_BASE_URL=http://localhost:5000  ✅ Correct
```

## 🚀 Running the Application

### Terminal 1 - Backend
```bash
cd /Users/krishnaverma/Desktop/Capstone_sem3/backend
npm run dev
```
**Expected Output:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

### Terminal 2 - Frontend
```bash
cd /Users/krishnaverma/Desktop/Capstone_sem3/frontend
npm run dev
```
**Expected Output:**
```
VITE v5.4.21  ready in 91 ms
➜ Local:   http://localhost:5173/
➜ Network: use --host to expose
```

## ✅ Verification Checklist

- [x] Backend running on port 5000
- [x] Frontend running on port 5173
- [x] CORS configured for localhost:5173
- [x] Axios baseURL points to localhost:5000
- [x] All API calls use relative paths (e.g., '/api/auth/login')
- [x] No hardcoded localhost:3000 anywhere
- [x] Environment variables correctly set

## 🧪 Testing URLs

### Health Check
```bash
curl http://localhost:5000/
```
**Expected Response:**
```json
{
  "message": "Welcome to SocietyConnect API",
  "version": "1.0.0",
  "status": "running"
}
```

### Test Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@site.com","password":"admin123"}'
```

### Frontend Access
- Open browser: `http://localhost:5173`
- Should see login page
- No CORS errors in console

## 🐛 Troubleshooting

### "CORS Error" in browser console
- ✅ Fixed: Backend CORS now allows localhost:5173

### "Network Error" when making API calls
- Check: Backend is running on port 5000
- Check: Frontend .env has correct VITE_API_BASE_URL

### "Port already in use"
- Backend: Change PORT in backend/.env
- Frontend: Vite will auto-suggest alternative port

## 📊 API Request Flow

1. **User Action**: Clicks login button in browser at `localhost:5173`
2. **Frontend**: React calls `axios.post('/api/auth/login', data)`
3. **Axios**: Prepends baseURL → `http://localhost:5000/api/auth/login`
4. **Axios**: Adds JWT token from localStorage to Authorization header
5. **Browser**: Sends HTTP POST request to backend
6. **CORS**: Backend checks origin (localhost:5173) → ✅ Allowed
7. **Backend**: Processes request and sends JSON response
8. **Frontend**: Receives response and updates UI

## 🎯 Summary

All URLs are now correctly configured:
- **Backend API**: `localhost:5000` ✅
- **Frontend App**: `localhost:5173` ✅
- **CORS**: Properly configured ✅
- **Axios**: Points to correct backend ✅
- **No hardcoded URLs**: All using environment variables ✅

---

**Last Updated**: November 4, 2025
**Status**: ✅ All configurations verified and working
