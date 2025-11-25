# SocietyConnect Frontend

React + Vite frontend application for SocietyConnect - A society management system.

## 🚀 Features

- **User Authentication**: Login and Signup with JWT tokens
- **Protected Routes**: Dashboard accessible only after authentication
- **Role-Based Dashboard**: Different views for Admin and Resident users
- **Complaint Management**: View complaints based on user role
- **Responsive Design**: Modern, clean UI that works on all devices
- **Token Management**: Automatic token storage and injection in API calls

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Backend API** origin is configured via `VITE_API_BASE_URL` in `frontend/.env` (set it to your deployed backend origin for production). In development you can leave it blank to use the current window origin.

## 🛠️ Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:

  Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your backend origin for production. Leave it empty in development to use the window origin.

  ```bash
  cp .env.example .env
  # Example (production):
  # VITE_API_BASE_URL=https://your-backend.onrender.com
  ```

## 🏃‍♂️ Running the Application

### Development Mode:
```bash
npm run dev
```

The Vite dev server runs on port `5173` by default (the exact URL will be printed by Vite when the dev server starts). The frontend uses `VITE_API_BASE_URL` to connect to the backend.

### Build for Production:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js           # Axios instance with interceptors
│   ├── components/
│   │   ├── Navbar.jsx         # Navigation bar component
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Login.jsx          # Login page
│   │   ├── Login.css
│   │   ├── Signup.jsx         # Signup page
│   │   ├── Dashboard.jsx      # Dashboard page
│   │   └── Dashboard.css
│   ├── App.jsx                # Main app component with routes
│   ├── App.css
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── vite.config.js            # Vite configuration
├── package.json
├── .env                      # Environment variables (not in repo)
└── .env.example             # Example environment variables
```

## 🔐 Authentication Flow

1. **Login/Signup**: User enters credentials
2. **Token Storage**: JWT token is stored in localStorage
3. **Protected Routes**: Token is checked before accessing dashboard
4. **API Calls**: Token is automatically added to Authorization header
5. **Logout**: Token is removed and user is redirected to login

## 📱 Pages

### Login (`/`)
- Email and password authentication
- Demo credentials displayed
- Redirect to dashboard on success

### Signup (`/signup`)
- User registration form
- Fields: Name, Email, Password, Role, Apartment (for residents)
- Auto-login after successful signup

### Dashboard (`/dashboard`)
- Protected route (requires authentication)
- Shows user complaints statistics
- Lists all complaints (Admin) or user's complaints (Resident)
- Color-coded status badges

## 🎨 Styling

- Modern gradient background
- Clean card-based UI
- Responsive design for mobile and desktop
- Smooth transitions and hover effects
- Color-coded status badges:
  - 🟡 **Pending**: Yellow (#ffc107)
  - 🔵 **In Progress**: Blue (#17a2b8)
  - 🟢 **Resolved**: Green (#28a745)

## 🔑 Demo Credentials

After seeding the backend database:

**Admin:**
- Email: `admin@site.com`
- Password: `admin123`

**Resident:**
- Email: `resident@site.com`
- Password: `resident123`

## 🛡️ Security Features

- JWT token authentication
- Protected routes
- Automatic token expiration handling
- Token removal on 401 errors
- Secure password input fields

## 🔧 Technologies Used

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client with interceptors
- **CSS3**: Styling with modern features

## 📝 API Integration

The frontend connects to the backend API based on `VITE_API_BASE_URL` (set this in `frontend/.env` for production). If left blank, the frontend will use the window origin.

**Endpoints used:**
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/complaints` - Fetch complaints (authenticated)

## 🐛 Troubleshooting

### Backend Connection Error
- Ensure backend server is running on port 5000
- Check if `VITE_API_BASE_URL` in `.env` is correct
- Verify CORS is properly configured (if needed)

### Token Errors
- Clear localStorage and login again
- Check if token is being stored: `localStorage.getItem('token')`
- Verify backend JWT_SECRET is set correctly

### Page Not Loading
- Check browser console for errors
- Ensure all dependencies are installed
- Try clearing cache and restarting dev server

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Future Enhancements

- Add complaint creation form
- Implement payment viewing
- Add notification system
- User profile management
- Dark mode toggle
- Real-time updates with WebSockets

## 📄 License

This project is created for educational purposes as a college capstone project.

---

**Happy Coding! 🚀**
