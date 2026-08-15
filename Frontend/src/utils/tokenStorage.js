const USER_KEY = 'transitops_user'
const TOKEN_KEY = 'transitops_token'

export function saveAuth(user, token) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(TOKEN_KEY, token)
}

export function getStoredUser() {
  const saved = localStorage.getItem(USER_KEY)
  return saved ? JSON.parse(saved) : null
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearAuth() {
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return !!getToken() && !!getStoredUser()
}