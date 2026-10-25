import React, { useEffect, useRef } from 'react';
import { AuraLogo } from '../UI/AuraLogo.jsx';
import { MessageBubble } from './MessageBubble.jsx';
import { useChat } from '../../context/ChatContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const ChatArea = () => {
  const { messages, isStreaming, streamingContent, streamingReasoning } = useChat();
  const { user } = useAuth();
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

  // Determine user first name and time-appropriate greeting
  const firstName = user?.name ? user.name.split(' ')[0] : 'Arthur';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

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
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.length === 0 && !isStreaming ? (
          /* Empty / Welcome State with Logo and Greeting Only */
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px 16px'
            }}
          >
            {/* Aura Logo */}
            <div style={{ marginBottom: '24px' }}>
              <AuraLogo size={58} animated={true} />
            </div>

            {/* Greeting: Good evening, Arthur */}
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginBottom: '0px',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{greeting},</span>
              <span
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#ea580c'
                }}
              >
                {firstName}
              </span>
            </h1>
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
