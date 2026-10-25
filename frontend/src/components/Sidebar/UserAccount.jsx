import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const UserAccount = () => {
  const { user, logout, openLogin } = useAuth();

  const displayName = user?.name || 'Arthur Morgan';
  const displayEmail = user?.email || 'test321@gmail.com';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      style={{
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
        borderRadius: '16px',
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {/* Avatar with Online Dot */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f95716',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.95rem'
            }}
          >
            {initial}
          </div>
          {/* Green Online Dot */}
          <div
            style={{
              position: 'absolute',
              bottom: '0px',
              right: '0px',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              border: '2px solid var(--surface)'
            }}
          />
        </div>

        {/* User Info */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: '0.86rem',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              fontSize: '0.73rem',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {displayEmail}
          </div>
        </div>
      </div>

      {/* Logout Action Button */}
      <button
        onClick={user ? logout : openLogin}
        title={user ? 'Sign out' : 'Sign in'}
        style={{
          padding: '6px',
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          color: 'var(--text-muted)',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.18s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#f95716';
          e.currentTarget.style.background = 'rgba(249, 87, 22, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.background = 'transparent';
        }}
        aria-label="Account Action"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
};

