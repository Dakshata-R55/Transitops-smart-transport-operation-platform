import { createContext, useContext, useState, useEffect } from 'react'
import {
  saveAuth,
  clearAuth,
  getStoredUser,
  getToken,
  isAuthenticated,
} from '../utils/tokenStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = getStoredUser()
    const savedToken = getToken()

    if (savedUser && savedToken) {
      setUser(savedUser)
      setToken(savedToken)
    }

    setIsLoading(false)
  }, [])

  function loginUser(authResponse) {
    const userData = {
      id: authResponse.id,
      fullName: authResponse.fullName,
      email: authResponse.email,
      phone: authResponse.phone,
      role: authResponse.role,
    }

    saveAuth(userData, authResponse.token)
    setUser(userData)
    setToken(authResponse.token)
  }

  function logoutUser() {
    clearAuth()
    setUser(null)
    setToken(null)
  }

  const value = {
    user,
    token,
    role: user?.role ?? null,
    isAuthenticated: isAuthenticated(),
    isLoading,
    loginUser,
    logoutUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}