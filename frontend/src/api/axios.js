import axios from 'axios'

// Base URL should be the server origin (do NOT append '/api' here)
const DEFAULT_API_BASE = 'http://localhost:3000'
const apiBase =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : DEFAULT_API_BASE)

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Add request interceptor to include JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clear auth and redirect
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
      return Promise.reject({ message: 'Unauthorized', status: 401, original: error })
    }

    // Normalize error message for callers
    const serverMessage = error?.response?.data?.message || error?.response?.data || null
    const message = serverMessage || error.message || 'Network or server error'
    return Promise.reject({ message, status: error?.response?.status, original: error })
  }
)

export default axiosInstance
