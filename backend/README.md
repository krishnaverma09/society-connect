# SocietyConnect Backend

A complete backend system for managing society/apartment complex operations including complaints, payments, and notifications.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Admin and Resident roles with specific permissions
- **Complaint Management**: Residents can create complaints, admins can manage them
- **Payment Tracking**: Admins can create payment records, users can view their payments
- **Notifications**: Admin can send notifications to residents
- **Input Validation**: Using express-validator for robust input validation

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (running locally or a MongoDB Atlas account)
- **npm** or **yarn** package manager

## 🛠️ Installation

1. **Clone or navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your configuration:
     ```
     MONGO_URI=mongodb://localhost:27017/societyconnect
     JWT_SECRET=your_super_secret_jwt_key_here
     JWT_EXPIRES_IN=7d
     BCRYPT_SALT_ROUNDS=10
     PORT=5000
     ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Seed the database** (optional but recommended):
   ```bash
   npm run seed
   ```
   This will create two sample users:
   - **Admin**: admin@site.com / admin123
   - **Resident**: resident@site.com / resident123

## 🏃‍♂️ Running the Application

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── controllers/          # Request handlers
│   ├── auth.controller.js
│   ├── complaint.controller.js
│   ├── payment.controller.js
│   └── notification.controller.js
├── middleware/          # Custom middleware
│   ├── auth.middleware.js
│   └── role.middleware.js
├── models/             # MongoDB schemas
│   ├── User.js
│   ├── Complaint.js
│   ├── Payment.js
│   └── Notification.js
├── routes/            # API routes
│   ├── auth.routes.js
│   ├── complaint.routes.js
│   ├── payment.routes.js
│   └── notification.routes.js
├── seed/              # Database seeding
│   └── seed.js
├── server.js         # Entry point
├── package.json
├── .env             # Environment variables (not in repo)
├── .env.example     # Example environment variables
└── README.md
```

## 🔐 API Endpoints

### Authentication (`/api/auth`)

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "resident",
  "apartment": "A-101"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Complaints (`/api/complaints`)

#### Get All Complaints
```http
GET /api/complaints
Authorization: Bearer <token>
```

#### Create Complaint (Resident only)
```http
POST /api/complaints
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Water leakage in bathroom",
  "description": "The bathroom tap is leaking continuously"
}
```

#### Update Complaint Status (Admin only)
```http
PUT /api/complaints/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "assignedTo": "userId"
}
```

### Payments (`/api/payments`)

#### Get All Payments
```http
GET /api/payments
Authorization: Bearer <token>
```

#### Create Payment (Admin only)
```http
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "resident": "userId",
  "amount": 5000,
  "dueDate": "2025-12-01",
  "description": "Monthly maintenance fee"
}
```

### Notifications (`/api/notifications`)

#### Get Notifications
```http
GET /api/notifications
Authorization: Bearer <token>
```

#### Create Notification (Admin only)
```http
POST /api/notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "user": "userId",
  "title": "Maintenance Notice",
  "message": "Society maintenance scheduled for this weekend"
}
```

## 🔑 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles

- **resident**: Can create complaints, view own complaints and payments
- **admin**: Full access - can manage all complaints, create payments, send notifications

## 🧪 Testing the API

You can test the API using:
- **Postman**: Import the endpoints and test them
- **cURL**: Use command-line requests
- **Thunder Client**: VS Code extension for API testing

Example cURL request:
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"resident","apartment":"A-101"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-validator**: Input validation
- **dotenv**: Environment variables
- **nodemon**: Auto-restart server (dev dependency)

## ⚠️ Important Notes

1. **Change JWT_SECRET**: Always use a strong, unique secret in production
2. **Database**: Make sure MongoDB is running before starting the server
3. **First User**: Create an admin user first to manage the system
4. **Environment Variables**: Never commit the `.env` file to version control

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check if MONGO_URI in `.env` is correct
- Verify MongoDB port (default: 27017)

### JWT Token Errors
- Make sure JWT_SECRET is set in `.env`
- Check if token is included in Authorization header
- Verify token format: `Bearer <token>`

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using the port:
  ```bash
  lsof -ti:5000 | xargs kill -9
  ```

## 📝 License

This project is created for educational purposes as a college capstone project.

## 👨‍💻 Support

For issues or questions, please contact your project supervisor or team members.

---

**Happy Coding! 🚀**
