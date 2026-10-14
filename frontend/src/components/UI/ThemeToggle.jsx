import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      id="theme-toggle-switch"
      role="button"
      tabIndex={0}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '5px 7px',
        borderRadius: '30px',
        cursor: 'pointer',
        background: 'var(--surface)',
        boxShadow: 'var(--neu-pressed)',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        width: '68px',
        height: '34px',
        userSelect: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Background Icons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '0 4px',
          opacity: 0.6
        }}
      >
        <Sun size={14} color="#f59e0b" />
        <Moon size={14} color="#38bdf8" />
      </div>

      {/* Tactile Sliding Toggle Knob */}
      <div
        style={{
          position: 'absolute',
          top: '3px',
          left: isDark ? '37px' : '3px',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: isDark
            ? 'linear-gradient(135deg, #1e2430, #14171f)'
            : 'linear-gradient(135deg, #ffffff, #e2e8f0)',
          boxShadow: isDark
            ? '2px 2px 6px #090b0e, -2px -2px 6px #242c3b'
            : '2px 2px 6px #bcc4d2, -2px -2px 6px #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {isDark ? (
          <Moon size={13} color="#38bdf8" strokeWidth={2.5} />
        ) : (
          <Sun size={13} color="#d97706" strokeWidth={2.5} />
        )}
      </div>
    </div>
  );
};
