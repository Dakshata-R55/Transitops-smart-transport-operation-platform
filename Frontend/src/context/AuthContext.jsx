import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on refresh
  useEffect(() => {
    const saved = localStorage.getItem('transitops_user')
    if (saved) {
      setUser(JSON.parse(saved))
    }
    setIsLoading(false)
  }, [])

  function loginUser(userData) {
    setUser(userData)
    localStorage.setItem('transitops_user', JSON.stringify(userData))
  }

  function logoutUser() {
    setUser(null)
    localStorage.removeItem('transitops_user')
  }

  const value = {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
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