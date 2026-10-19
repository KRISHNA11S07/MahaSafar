import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../lib/theme';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Dark mode' : 'Light mode'}
    >
      <span className="theme-toggle__icon" key={theme}>
        {isLight ? <Moon size={16} /> : <Sun size={16} />}
      </span>
    </button>
  );
}
