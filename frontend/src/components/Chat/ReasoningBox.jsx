import React, { useState } from 'react';
import { Brain, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';

export const ReasoningBox = ({ reasoning, reasoningDetails, isStreaming = false }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Extract text from reasoningDetails or raw reasoning string
  let reasoningText = reasoning || '';
  if (!reasoningText && Array.isArray(reasoningDetails) && reasoningDetails.length > 0) {
    reasoningText = reasoningDetails.map((item) => item.text || JSON.stringify(item)).join('\n');
  }

  if (!reasoningText && !isStreaming) return null;

  return (
    <div
      style={{
        margin: '10px 0 16px 0',
        borderRadius: '14px',
        backgroundColor: 'var(--reasoning-bg)',
        border: '1px solid var(--reasoning-border)',
        boxShadow: 'var(--neu-inset-subtle)',
        overflow: 'hidden',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Header bar / Accordion trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'transparent',
          border: 'none',
          color: 'var(--accent-color)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.82rem',
          fontWeight: 600,
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain
            size={16}
            className={isStreaming ? 'animate-pulse-glow' : ''}
            color="var(--accent-color)"
          />
          <span>
            {isStreaming ? 'Reasoning in progress...' : 'Step-by-Step Reasoning'}
          </span>
          {isStreaming && (
            <span
              style={{
                fontSize: '0.68rem',
                padding: '2px 6px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--accent-color)'
              }}
            >
              Generating tokens
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '0.72rem' }}>{isOpen ? 'Hide' : 'Inspect'}</span>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div
          style={{
            padding: '12px 16px 14px 16px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.84rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '320px',
            overflowY: 'auto'
          }}
          className={isStreaming ? 'thinking-shimmer' : ''}
        >
          {reasoningText || 'Analyzing context and formulating reasoned response...'}
        </div>
      )}
    </div>
  );
};
