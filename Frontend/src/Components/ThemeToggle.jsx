import { useTheme } from '../context/ThemeContext'

function ThemeToggle({ label = 'Theme' }) {
  const { theme, setLightTheme, setDarkTheme } = useTheme()

  return (
    <div className="theme-toggle">
      <span className="theme-toggle-label">{label}</span>

      <div className="theme-toggle-options">
        <button
          type="button"
          className={`theme-option ${theme === 'light' ? 'active' : ''}`}
          onClick={setLightTheme}
        >
          Light
        </button>

        <button
          type="button"
          className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
          onClick={setDarkTheme}
        >
          Dark
        </button>
      </div>
    </div>
  )
}

export default ThemeToggle