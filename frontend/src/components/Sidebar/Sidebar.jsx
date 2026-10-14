import React from 'react';
import { Sparkles, X } from 'lucide-react';
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
          boxShadow: '3px 0 15px rgba(0, 0, 0, 0.05)',
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
            marginBottom: '22px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '13px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: 'var(--accent-shadow)'
              }}
            >
              <Sparkles size={22} strokeWidth={2.2} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Aura AI
                <span
                  style={{
                    fontSize: '0.62rem',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: 'var(--surface)',
                    boxShadow: 'var(--neu-subtle)',
                    color: 'var(--accent-color)',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}
                >
                  Pro
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Intelligent Neumorphic Chat
              </div>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="neu-btn mobile-close-btn"
            style={{
              display: 'none',
              padding: '6px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent'
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
