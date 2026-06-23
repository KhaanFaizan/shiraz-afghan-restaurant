import axios from 'axios'

const api = axios.create({
  // Relative URL — Vite proxies /api → http://localhost:5000 in dev.
  // In production, set VITE_API_URL to your deployed backend URL.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach auth token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shiraz_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('shiraz_token')
    }
    return Promise.reject(error)
  }
)

/**
 * Extract a human-readable error message from an Axios error.
 *
 * Handles three cases:
 *   1. No response (server down / network error)
 *   2. Backend returned Zod validation errors array
 *   3. Backend returned a plain message string
 */
export function extractApiError(err, fallback = 'Something went wrong. Please try again.') {
  if (!err.response) {
    return 'Unable to connect to the server. Please check your connection.'
  }
  const { data } = err.response
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.message).join('. ')
  }
  return data?.message || fallback
}

export default api
