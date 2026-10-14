import React, { useEffect, useRef } from 'react';
import { Sparkles, Brain, Bot, MessageSquareQuote } from 'lucide-react';
import { MessageBubble } from './MessageBubble.jsx';
import { useChat } from '../../context/ChatContext.jsx';

export const ChatArea = () => {
  const { messages, isStreaming, streamingContent, streamingReasoning } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, streamingReasoning]);

  const liveStreamingMessage = isStreaming
    ? {
        role: 'assistant',
        content: streamingContent,
        reasoning: streamingReasoning,
        isGeneratingReasoning: Boolean(streamingReasoning && !streamingContent),
        createdAt: new Date().toISOString()
      }
    : null;

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', flex: 1 }}>
        {messages.length === 0 && !isStreaming ? (
          /* Empty / Welcome State */
          <div
            style={{
              height: '100%',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '40px 16px'
            }}
          >
            <div
              className="neu-flat animate-pulse-glow"
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-color)',
                marginBottom: '20px',
                background: 'var(--surface-raised)'
              }}
            >
              <Bot size={36} strokeWidth={2} />
            </div>

            <h2
              style={{
                fontSize: '1.65rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '10px'
              }}
            >
              Minimalist AI Assistant
            </h2>

            <p
              style={{
                maxWidth: '520px',
                fontSize: '0.94rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '32px'
              }}
            >
              An intelligent conversational assistant featuring deep step-by-step reasoning
              and seamless tactile neumorphic controls. Ask questions, solve complex logic, or explore ideas.
            </p>

            {/* Feature Highlights Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                width: '100%',
                maxWidth: '720px'
              }}
            >
              <div
                className="neu-flat"
                style={{ padding: '18px', textAlign: 'left', borderRadius: '16px' }}
              >
                <div style={{ color: 'var(--accent-color)', marginBottom: '8px' }}>
                  <Brain size={22} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '4px' }}>
                  Internal Reasoning
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Inspect the step-by-step thinking process before the final response.
                </div>
              </div>

              <div
                className="neu-flat"
                style={{ padding: '18px', textAlign: 'left', borderRadius: '16px' }}
              >
                <div style={{ color: 'var(--accent-color)', marginBottom: '8px' }}>
                  <Sparkles size={22} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '4px' }}>
                  Tactile Neumorphism
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Comfortable, balanced light and dark palettes with soft ambient depth.
                </div>
              </div>

              <div
                className="neu-flat"
                style={{ padding: '18px', textAlign: 'left', borderRadius: '16px' }}
              >
                <div style={{ color: 'var(--accent-color)', marginBottom: '8px' }}>
                  <MessageSquareQuote size={22} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '4px' }}>
                  Context Continuity
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Preserves reasoning traces across messages for uninterrupted logic.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Conversation Messages */
          <>
            {messages.map((msg, index) => (
              <MessageBubble key={msg._id || index} message={msg} />
            ))}

            {/* Live Streaming Assistant Message */}
            {liveStreamingMessage && (
              <MessageBubble message={liveStreamingMessage} isStreaming={true} />
            )}
          </>
        )}

        <div ref={bottomRef} style={{ height: '10px' }} />
      </div>
    </div>
  );
};
