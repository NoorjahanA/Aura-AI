import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square, Lightbulb } from 'lucide-react';
import { useChat } from '../../context/ChatContext.jsx';

export const ChatInput = () => {
  const { sendMessage, isStreaming, stopStreaming, reasoningVisible, setReasoningVisible } = useChat();
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

  return (
    <div
      style={{
        padding: '12px 24px 20px 24px',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>
        {/* Input Bar Form */}
        <form
          onSubmit={handleSubmit}
          className="human-chatbar"
        >
          {/* Reasoning Toggle Pill */}
          <button
            type="button"
            onClick={() => setReasoningVisible(!reasoningVisible)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '9999px',
              background: reasoningVisible ? 'rgba(249, 87, 22, 0.16)' : 'rgba(255, 255, 255, 0.05)',
              border: reasoningVisible ? '1px solid rgba(249, 87, 22, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: reasoningVisible ? '#f95716' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            title="Toggle Reasoning"
          >
            <Lightbulb size={14} color={reasoningVisible ? '#f95716' : 'currentColor'} />
            <span>Reasoning</span>
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Aura..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              resize: 'none',
              padding: '8px 8px',
              fontFamily: 'inherit',
              fontSize: '0.94rem',
              lineHeight: 1.5,
              color: 'var(--text-primary)',
              maxHeight: '160px'
            }}
          />

          {/* Action Button: Send or Stop */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {isStreaming ? (
              <button
                type="button"
                onClick={stopStreaming}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--danger-color)',
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Stop Generation"
              >
                <Square size={13} fill="currentColor" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: input.trim() ? '#f95716' : 'rgba(255, 255, 255, 0.06)',
                  color: input.trim() ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: input.trim() ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
                title="Send Message"
              >
                <ArrowUp size={16} strokeWidth={2.2} />
              </button>
            )}
          </div>
        </form>

        {/* Disclaimer Footer Text matching picture */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            marginTop: '12px',
            userSelect: 'none'
          }}
        >
          Aura can make mistakes. Double-check important facts.
        </div>
      </div>
    </div>
  );
};

