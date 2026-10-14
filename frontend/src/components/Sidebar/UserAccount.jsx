import React from 'react';
import { LogIn, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const UserAccount = () => {
  const { user, logout, openLogin } = useAuth();

  return (
    <div
      className="neu-flat"
      style={{
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {/* Avatar */}
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--surface-raised)',
            boxShadow: 'var(--neu-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            border: '2px solid var(--border-subtle)'
          }}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || 'User'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <UserIcon size={20} color="var(--accent-color)" />
          )}
        </div>

        {/* User Info */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: '0.88rem',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {user ? user.name : 'Guest Explorer'}
          </div>
          <div
            style={{
              fontSize: '0.74rem',
              color: user ? 'var(--text-secondary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: user ? 'var(--success-color)' : 'var(--text-muted)'
              }}
            />
            {user ? user.email : 'Local Session'}
          </div>
        </div>
      </div>

      {/* Auth Action Button */}
      {user ? (
        <button
          onClick={logout}
          className="neu-btn"
          title="Sign out of account"
          style={{
            padding: '8px',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            color: 'var(--danger-color)',
            flexShrink: 0
          }}
          aria-label="Logout"
        >
          <LogOut size={16} />
        </button>
      ) : (
        <button
          onClick={openLogin}
          className="neu-btn"
          title="Sign in or create account"
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            color: 'var(--accent-color)',
            fontWeight: 600,
            flexShrink: 0
          }}
        >
          <LogIn size={14} /> Sign In
        </button>
      )}
    </div>
  );
};
