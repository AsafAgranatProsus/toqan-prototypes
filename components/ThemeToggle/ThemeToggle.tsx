import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../Icons/Icons';
import './ThemeToggle.css';

export const ThemeToggle: React.FC = () => {
  const { themeName, toggleTheme } = useTheme();
  const isDark = themeName === 'dark';

  return (
    <button
      className="theme-toggle-button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      type="button"
      aria-pressed={isDark}
    >
      <div className={`theme-toggle-highlight ${isDark ? 'right' : 'left'}`} />
      <div className={`theme-toggle-option ${!isDark ? 'active' : ''}`}>
        <Icons name="Sun" className="theme-toggle-icon" aria-hidden="true" />
      </div>
      <div className={`theme-toggle-option ${isDark ? 'active' : ''}`}>
        <Icons name="Moon" className="theme-toggle-icon" aria-hidden="true" />
      </div>
    </button>
  );
};

