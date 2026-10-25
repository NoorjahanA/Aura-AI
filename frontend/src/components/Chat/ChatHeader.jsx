import React from 'react';
import { Menu, Brain } from 'lucide-react';
import { AuraLogo } from '../UI/AuraLogo.jsx';
import { ThemeToggle } from '../UI/ThemeToggle.jsx';
import { useChat } from '../../context/ChatContext.jsx';

export const ChatHeader = ({ onToggleSidebar }) => {
  const { activeConversation, reasoningVisible, setReasoningVisible } = useChat();

  return (
    <header
      style={{
        height: '56px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Mobile Toggle Button */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={onToggleSidebar}
          className="mobile-menu-btn"
          style={{
            padding: '8px',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Right: Theme Switch in Top Right Corner */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <ThemeToggle />
      </div>
    </header>
  );
};
