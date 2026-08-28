import { useTheme } from '../lib/theme-context'
import { ThemeToggleButton } from './Buttons'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const dark = theme === 'dark'

  return (
    <ThemeToggleButton
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? (
        <Moon className="w-4 h-4 shrink-0 block m-auto text-current" />
      ) : (
        <Sun className="w-4 h-4 shrink-0 block m-auto text-current" />
      )}
    </ThemeToggleButton>
  )
}