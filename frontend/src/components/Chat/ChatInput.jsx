import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Sparkles, CornerDownLeft } from 'lucide-react';
import { useChat } from '../../context/ChatContext.jsx';

const SUGGESTIONS = [
  "How many r's are in the word 'strawberry'?",
  "Explain quantum entanglement with step-by-step logic",
  "Write a robust Express.js middleware for rate limiting",
  "Solve: A farmer has 17 sheep and all but 9 die. How many are left?"
];

export const ChatInput = () => {
  const { sendMessage, isStreaming, stopStreaming, messages } = useChat();
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize input height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (text) => {
    setInput(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div
      style={{
        padding: '16px 24px 22px 24px',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        {/* Suggestion Chips when conversation is fresh */}
        {messages.length <= 1 && (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '12px',
              scrollbarWidth: 'none'
            }}
          >
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="neu-btn"
                style={{
                  padding: '7px 13px',
                  fontSize: '0.78rem',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={12} color="var(--accent-color)" />
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar Form */}
        <form
          onSubmit={handleSubmit}
          className="neu-flat"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            padding: '8px 10px 8px 18px',
            borderRadius: '20px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            position: 'relative'
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or reasoning question... (Enter to send, Shift+Enter for newline)"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              resize: 'none',
              padding: '8px 0',
              fontFamily: 'inherit',
              fontSize: '0.94rem',
              lineHeight: 1.5,
              color: 'var(--text-primary)',
              maxHeight: '160px'
            }}
          />

          {/* Action Button: Send or Stop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '10px' }}>
            {isStreaming ? (
              <button
                type="button"
                onClick={stopStreaming}
                className="neu-btn"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  padding: 0,
                  color: 'var(--danger-color)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)'
                }}
                title="Stop Generation"
              >
                <Square size={16} fill="currentColor" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="neu-btn neu-btn-primary"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  padding: 0,
                  opacity: input.trim() ? 1 : 0.6,
                  cursor: input.trim() ? 'pointer' : 'default'
                }}
                title="Send Message"
              >
                <Send size={17} />
              </button>
            )}
          </div>
        </form>

        {/* Minimal Footer Info */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            marginTop: '8px'
          }}
        >
          Minimalist Neumorphic Interface • Step-by-step reasoning enabled
        </div>

      </div>
    </div>
  );
};
