import React from 'react';
import { Plus, MessageSquare, Trash2, Search } from 'lucide-react';
import { useChat } from '../../context/ChatContext.jsx';

export const ChatHistoryList = () => {
  const {
    conversations,
    activeId,
    selectConversation,
    createNewChat,
    deleteChat,
    searchQuery,
    setSearchQuery
  } = useChat();

  const filtered = conversations.filter((c) =>
    (c.title || 'Untitled Chat').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* New Chat Button */}
      <button
        onClick={createNewChat}
        style={{
          width: '100%',
          padding: '11px 18px',
          borderRadius: '9999px',
          fontWeight: 600,
          fontSize: '0.92rem',
          marginBottom: '16px',
          background: '#f95716',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 16px rgba(249, 87, 22, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(249, 87, 22, 0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(249, 87, 22, 0.35)';
        }}
      >
        <Plus size={18} strokeWidth={2.5} />
        New chat
      </button>

      {/* Filter / Search Bar */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search
          size={14}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }}
        />
        <input
          type="text"
          placeholder="Search chats"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '9px 12px 9px 34px',
            fontSize: '0.84rem',
            borderRadius: '12px',
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(249, 87, 22, 0.5)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 87, 22, 0.12)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Section Header */}
      <div
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          marginBottom: '10px',
          paddingLeft: '4px'
        }}
      >
        RECENT
      </div>

      {/* Conversations Scrollable List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingRight: '4px',
          marginRight: '-4px'
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '16px 4px',
              color: 'var(--text-muted)',
              fontSize: '0.82rem'
            }}
          >
            {searchQuery ? 'No matching chats found' : 'Your chats will show up here'}
          </div>
        ) : (
          filtered.map((conv) => {
            const id = conv._id || conv.id;
            const isActive = activeId === id;

            return (
              <div
                key={id}
                onClick={() => selectConversation(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: isActive ? 'rgba(217, 98, 43, 0.1)' : 'var(--surface)',
                  border: isActive
                    ? '1px solid rgba(217, 98, 43, 0.35)'
                    : '1px solid var(--border-subtle)',
                  boxShadow: isActive
                    ? '0 2px 8px rgba(217, 98, 43, 0.1)'
                    : '0 1px 3px rgba(85, 60, 35, 0.02)',
                  transition: 'all 0.18s ease',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--surface-raised)';
                    e.currentTarget.style.borderColor = 'rgba(217, 98, 43, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--surface)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    minWidth: 0,
                    flex: 1
                  }}
                >
                  <MessageSquare
                    size={16}
                    color={isActive ? 'var(--accent-color)' : 'var(--text-muted)'}
                    style={{ flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {conv.title || 'Untitled Conversation'}
                  </span>
                </div>

                <button
                  onClick={(e) => deleteChat(id, e)}
                  title="Delete conversation"
                  style={{
                    padding: '5px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    opacity: 0.6,
                    color: 'var(--text-muted)',
                    marginLeft: '6px',
                    flexShrink: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.18s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--danger-color)';
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.opacity = '0.6';
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
