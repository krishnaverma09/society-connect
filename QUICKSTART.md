# 🚀 Quick Start Guide - SocietyConnect

## Setup Instructions (First Time Only)

### Step 1: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Make sure .env file exists with proper configuration
# MONGO_URI should point to your MongoDB instance
# JWT_SECRET should be a strong random string

# Seed the database with sample data
npm run seed
```

### Step 2: Frontend Setup
```bash
# Navigate to frontend directory (open a new terminal)
cd frontend

# Install dependencies
npm install

# Make sure .env file exists
# VITE_API_BASE_URL should point to backend (default: http://localhost:5000)
```

## Running the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
✅ Backend will run on: `http://localhost:5000`

### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```
✅ Frontend will run on: `http://localhost:3000`

### Terminal 3 - MongoDB (if running locally)
```bash
mongod
```
✅ MongoDB will run on: `localhost:27017`

## 🔑 Login Credentials

After seeding the database, use these credentials:

### Admin Account
- **Email**: admin@site.com
- **Password**: admin123
- **Features**: View all complaints, update status, create payments

### Resident Account
- **Email**: resident@site.com
- **Password**: resident123
- **Features**: Create complaints, view own complaints and payments

## 🧪 Testing the Application

1. Open browser and go to `http://localhost:3000`
2. Login with one of the demo accounts
3. You should see the dashboard with complaints data
4. Try logging out and logging in with a different account

## ✅ Checklist Before Running

- [ ] MongoDB is installed and running
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Backend .env file configured with MONGO_URI and JWT_SECRET
- [ ] Frontend .env file configured with VITE_API_BASE_URL
- [ ] Database seeded with `npm run seed` (in backend/)
- [ ] Backend server running on port 5000
- [ ] Frontend dev server running on port 3000

## 🐛 Common Issues

### "Cannot connect to MongoDB"
- Solution: Make sure MongoDB is running (`mongod` command)

### "Port 5000 already in use"
- Solution: Change PORT in backend/.env file

### "Port 3000 already in use"
- Solution: Vite will automatically suggest a different port

### "Invalid token" or "User not found"
- Solution: Clear browser localStorage and login again

### Frontend shows "Network Error"
- Solution: Make sure backend is running on port 5000
- Check VITE_API_BASE_URL in frontend/.env

## 📝 Important Notes

1. **Always run backend before frontend**
2. **Keep both servers running** while testing
3. **Don't commit .env files** to git (already in .gitignore)
4. **Seed data only once** unless you want to reset the database
5. **Use different terminal windows** for backend and frontend

## 🎯 Quick Commands Reference

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with sample data
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📱 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017/societyconnect

## 🎓 For Demonstration

1. Open `http://localhost:3000`
2. Show login page
3. Login as Admin (admin@site.com / admin123)
4. Show dashboard with all complaints
5. Logout
6. Login as Resident (resident@site.com / resident123)
7. Show dashboard with resident's complaints only

---

**Everything ready to go! Happy coding! 🚀**
