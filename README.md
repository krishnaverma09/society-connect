# 🏢 SocietyConnect

A comprehensive full-stack web application for society/apartment complex management built with MERN stack (MongoDB, Express, React, Node.js).

## 📋 Project Overview

SocietyConnect is a college capstone project that enables efficient management of society operations including:
- User authentication and authorization
- Complaint management system
- Payment tracking
- Notification system
- Role-based access control (Admin & Resident)

## 🏗️ Project Structure

```
Capstone_sem3/
├── backend/                 # Node.js + Express backend
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth & role middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── seed/               # Database seeding
│   ├── server.js           # Entry point
│   ├── package.json
│   └── README.md
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── api/           # Axios configuration
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── README.md
│
└── README.md              # This file
```

## ✨ Features

### Backend
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose ODM
- ✅ JWT authentication
- ✅ Bcrypt password hashing
- ✅ Express-validator for input validation
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Database seeding script

### Frontend
- ✅ React 18 with Vite
- ✅ React Router for navigation
- ✅ Axios for API calls
- ✅ JWT token management with localStorage
- ✅ Protected routes
- ✅ Responsive modern UI
- ✅ Role-based dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
cd /Users/krishnaverma/Desktop/Capstone_sem3
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# MONGO_URI=mongodb://localhost:27017/societyconnect
# JWT_SECRET=your_secret_key

# Start MongoDB (if running locally)
mongod

# Seed the database (optional but recommended)
npm run seed

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start frontend development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 🔑 Demo Credentials

After running the seed script, use these credentials:

**Admin Account:**
- Email: `admin@site.com`
- Password: `admin123`

**Resident Account:**
- Email: `resident@site.com`
- Password: `resident123`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Complaints (Protected)
- `GET /api/complaints` - Get complaints
- `POST /api/complaints` - Create complaint (Resident)
- `PUT /api/complaints/:id` - Update complaint (Admin)

### Payments (Protected)
- `GET /api/payments` - Get payments
- `POST /api/payments` - Create payment (Admin)

### Notifications (Protected)
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification (Admin)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Environment**: dotenv

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: CSS3

## 📦 Dependencies

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "express-validator": "^7.0.1",
  "dotenv": "^16.3.1"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2"
}
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Input validation and sanitization
- Automatic token expiration handling

## 📱 Application Flow

1. **User Registration/Login**
   - User signs up or logs in
   - Backend validates credentials
   - JWT token is generated and sent to frontend
   - Token stored in localStorage

2. **Dashboard Access**
   - Frontend checks for valid token
   - Token is sent with every API request
   - Backend validates token via middleware
   - User accesses role-specific features

3. **Complaint Management**
   - Residents create complaints
   - Admins view all complaints
   - Admins update complaint status
   - Real-time status updates

## 🎨 UI Features

- Clean and modern design
- Gradient backgrounds
- Responsive layout
- Card-based components
- Color-coded status badges
- Smooth transitions and animations
- Mobile-friendly interface

## 🧪 Testing the Application

### Backend Testing
```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@site.com","password":"admin123"}'
```

### Frontend Testing
1. Open `http://localhost:3000`
2. Login with demo credentials
3. Navigate through the dashboard
4. Check complaints data

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Ensure MongoDB is running
- **Port Already in Use**: Change PORT in `.env`
- **JWT Errors**: Verify JWT_SECRET is set

### Frontend Issues
- **API Connection Error**: Check backend is running
- **Token Errors**: Clear localStorage and login again
- **Build Errors**: Delete `node_modules` and reinstall

## 📚 Documentation

For detailed documentation:
- Backend: See `/backend/README.md`
- Frontend: See `/frontend/README.md`

## 🚀 Deployment

### Backend Deployment (Example: Heroku)
```bash
# Add Heroku remote
heroku create societyconnect-api

# Set environment variables
heroku config:set MONGO_URI=your_mongo_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Example: Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

## 🎓 Educational Purpose

This project is developed as a college capstone project to demonstrate:
- Full-stack web development skills
- RESTful API design
- Authentication and authorization
- Database design and management
- Modern frontend development
- State management
- Routing and navigation

## 👥 User Roles

### Admin
- View all complaints
- Update complaint status
- Create payment records
- Send notifications to residents
- Manage society operations

### Resident
- Create complaints
- View own complaints
- View payment records
- Receive notifications
- Track complaint status

## 📈 Future Enhancements

- [ ] Add complaint creation form in frontend
- [ ] Implement payment management UI
- [ ] Add notification center
- [ ] User profile management
- [ ] File upload for complaints
- [ ] Real-time updates with WebSockets
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] Analytics dashboard
- [ ] Dark mode support

## 🤝 Contributing

This is a capstone project, but suggestions are welcome:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

**College Capstone Project - Semester 3**

## 📞 Support

For any queries or issues:
- Check the individual README files in backend and frontend folders
- Review the troubleshooting sections
- Contact your project supervisor

---

**Built with ❤️ using MERN Stack**

## 🎯 Project Goals Achieved

✅ Full-stack application with separate frontend and backend  
✅ RESTful API design  
✅ User authentication with JWT  
✅ Role-based access control  
✅ CRUD operations for complaints  
✅ Database integration with MongoDB  
✅ Modern React frontend with routing  
✅ Responsive UI design  
✅ Protected routes on both frontend and backend  
✅ Input validation and error handling  
✅ Environment-based configuration  
✅ Database seeding for testing  
✅ Complete documentation  

---

**Happy Coding! 🚀**
