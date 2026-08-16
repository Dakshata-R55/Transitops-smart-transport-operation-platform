import { createContext, useContext, useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'transitops-theme'

const ThemeContext = createContext(null)

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  function setLightTheme() {
    setTheme('light')
  }

  function setDarkTheme() {
    setTheme('dark')
  }

  const value = {
    theme,
    isDark: theme === 'dark',
    setLightTheme,
    setDarkTheme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }
  return context
}