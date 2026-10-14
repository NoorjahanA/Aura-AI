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
        className="neu-btn neu-btn-primary"
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '14px',
          fontWeight: 600,
          fontSize: '0.92rem',
          marginBottom: '16px',
          letterSpacing: '0.01em'
        }}
      >
        <Plus size={18} strokeWidth={2.5} />
        New Conversation
      </button>

      {/* Filter / Search Bar */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <Search
          size={15}
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
          placeholder="Filter conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="neu-input"
          style={{
            padding: '9px 12px 9px 34px',
            fontSize: '0.82rem',
            borderRadius: '12px'
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
          marginBottom: '8px',
          paddingLeft: '4px'
        }}
      >
        Chat History ({filtered.length})
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
              padding: '24px 12px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.82rem'
            }}
          >
            {searchQuery ? 'No matching chats found' : 'No previous conversations'}
          </div>
        ) : (
          filtered.map((conv) => {
            const id = conv._id || conv.id;
            const isActive = activeId === id;

            return (
              <div
                key={id}
                onClick={() => selectConversation(id)}
                className={isActive ? 'neu-pressed' : 'neu-subtle'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--accent-color)' : '1px solid transparent',
                  transition: 'all 0.18s ease',
                  userSelect: 'none'
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
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
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
                  className="neu-btn"
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
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--danger-color)';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
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
