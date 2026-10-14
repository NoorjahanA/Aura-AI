import React from 'react';
import { Menu, Sparkles, Brain } from 'lucide-react';
import { ThemeToggle } from '../UI/ThemeToggle.jsx';
import { useChat } from '../../context/ChatContext.jsx';

export const ChatHeader = ({ onToggleSidebar }) => {
  const { activeConversation, reasoningVisible, setReasoningVisible } = useChat();

  return (
    <header
      style={{
        height: '68px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Left: Mobile Toggle & Conversation Tab Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <button
          onClick={onToggleSidebar}
          className="neu-btn mobile-menu-btn"
          style={{
            padding: '8px',
            width: '38px',
            height: '38px',
            borderRadius: '10px'
          }}
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div
            className="neu-flat"
            style={{
              padding: '7px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              maxWidth: '420px'
            }}
          >
            <Sparkles size={15} color="var(--accent-color)" style={{ flexShrink: 0 }} />
            <h1
              style={{
                fontSize: '0.94rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: 0
              }}
            >
              {activeConversation?.title || 'Conversation Tab'}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Theme Switch in Top Right Corner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {/* Reasoning Toggle Pill */}
        <button
          onClick={() => setReasoningVisible(!reasoningVisible)}
          className={reasoningVisible ? 'neu-pressed' : 'neu-btn'}
          style={{
            padding: '6px 14px',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: reasoningVisible ? 'var(--accent-color)' : 'var(--text-muted)',
            borderRadius: '10px'
          }}
          title="Toggle Reasoning Visibility"
        >
          <Brain size={14} />
          <span className="reasoning-toggle-text">Reasoning</span>
        </button>

        {/* Dark / Light Theme Switch in Top Right Corner */}
        <ThemeToggle />
      </div>
    </header>
  );
};
