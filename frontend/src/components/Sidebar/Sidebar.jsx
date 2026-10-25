import React from 'react';
import { X } from 'lucide-react';
import { AuraLogo } from '../UI/AuraLogo.jsx';
import { ChatHistoryList } from './ChatHistoryList.jsx';
import { UserAccount } from './UserAccount.jsx';

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
            display: 'block'
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside
        style={{
          width: '310px',
          height: '100vh',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          padding: '22px 18px',
          borderRight: '1px solid var(--border-subtle)',
          boxShadow: '2px 0 16px rgba(0, 0, 0, 0.03)',
          position: 'relative',
          zIndex: 50,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0
        }}
        className={`app-sidebar ${isOpen ? 'open' : ''}`}
      >
        {/* App Header Branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AuraLogo size={32} animated={false} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)'
                }}
              >
                Aura
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  border: '1px solid #f95716',
                  color: '#f95716',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                PRO
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="mobile-close-btn"
            style={{
              display: 'none',
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--surface)',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat History List */}
        <ChatHistoryList />

        {/* Left Side Bottom User Account Component */}
        <UserAccount />
      </aside>
    </>
  );
};
