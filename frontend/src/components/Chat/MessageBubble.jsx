import React, { useState } from 'react';
import { User, Copy, Check } from 'lucide-react';
import { AuraLogo } from '../UI/AuraLogo.jsx';
import { ReasoningBox } from './ReasoningBox.jsx';

export const MessageBubble = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderContent = (content) => {
    if (!content) return null;

    // Simple parser for code blocks (```code```) and standard paragraphs
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
        const code = language ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div
            key={idx}
            style={{
              margin: '12px 0',
              borderRadius: '12px',
              backgroundColor: 'var(--code-bg)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden'
            }}
          >
            {language && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                <span>{language}</span>
              </div>
            )}
            <pre
              style={{
                padding: '14px',
                margin: 0,
                fontSize: '0.85rem',
                color: 'var(--code-text)',
                fontFamily: "'JetBrains Mono', monospace",
                overflowX: 'auto',
                lineHeight: 1.6
              }}
            >
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      return (
        <span
          key={idx}
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.68
          }}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: '14px',
        margin: '18px 0',
        width: '100%'
      }}
    >
      {/* Avatar Icon */}
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: isUser ? 'var(--surface-raised)' : 'var(--surface)',
          boxShadow: isUser
            ? '0 2px 6px rgba(85, 60, 35, 0.05)'
            : '0 4px 16px rgba(217, 98, 43, 0.25)',
          color: isUser ? 'var(--accent-color)' : '#ffffff',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {isUser ? <User size={18} /> : <AuraLogo size={24} animated={false} />}
      </div>

      {/* Bubble Container */}
      <div
        style={{
          maxWidth: isUser ? '78%' : '84%',
          minWidth: '120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start'
        }}
      >
        {/* Author Label */}
        <div
          style={{
            fontSize: '0.74rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>{isUser ? 'You' : 'Aura AI'}</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>
            {new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        {/* Message Card */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
            background: isUser ? 'var(--surface-raised)' : 'var(--surface)',
            border: isUser
              ? '1px solid rgba(217, 98, 43, 0.22)'
              : '1px solid var(--border-subtle)',
            boxShadow: isUser
              ? '0 2px 10px rgba(85, 60, 35, 0.03)'
              : '0 4px 20px -2px rgba(85, 60, 35, 0.05), 0 2px 6px -1px rgba(85, 60, 35, 0.02)',
            color: 'var(--text-primary)',
            fontSize: '0.94rem',
            position: 'relative',
            width: '100%'
          }}
        >
          {/* Message Text Content */}
          <div>{renderContent(message.content)}</div>

          {/* Action Row */}
          {!isUser && message.content && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
                marginTop: '12px',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 11px',
                  fontSize: '0.74rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--surface-raised)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check size={13} color="var(--success-color)" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
