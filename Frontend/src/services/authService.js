const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

/**
 * Sign up a new user
 * @param {{ fullName: string, email: string, phone: string, password: string, role: string }} userData
 */
export async function signup(userData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  // Try to read JSON error message from backend
  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      (typeof data === 'string' ? data : 'Sign up failed. Please try again.')
    throw new Error(message)
  }

  return data
}