import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../services/api.js';
import { streamChatCompletion } from '../services/openRouterService.js';
import { useAuth } from './AuthContext.jsx';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingReasoning, setStreamingReasoning] = useState('');
  const [reasoningVisible, setReasoningVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const abortControllerRef = useRef(null);

  // Initialize conversations
  useEffect(() => {
    loadConversations();
  }, [token]);

  const loadConversations = async () => {
    try {
      const list = await api.getConversations(token);
      setConversations(list);
      if (list.length > 0 && !activeId) {
        selectConversation(list[0]._id || list[0].id);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  const selectConversation = async (id) => {
    setActiveId(id);
    setStreamingContent('');
    setStreamingReasoning('');
    setIsStreaming(false);
    try {
      const conv = await api.getConversation(id, token);
      if (conv && conv.messages) {
        setMessages(conv.messages);
      } else {
        setMessages([]);
      }
    } catch {
      // Find in existing list
      const local = conversations.find((c) => (c._id === id || c.id === id));
      setMessages(local?.messages || []);
    }
  };

  const createNewChat = async () => {
    if (isStreaming) {
      stopStreaming();
    }
    const newConv = await api.createConversation({ title: 'New Neumorphic Chat' }, token);
    const updated = [newConv, ...conversations];
    setConversations(updated);
    localStorage.setItem('neu_conversations', JSON.stringify(updated));
    setActiveId(newConv._id || newConv.id);
    setMessages([]);
    setStreamingContent('');
    setStreamingReasoning('');
  };

  const deleteChat = async (id, e) => {
    e?.stopPropagation();
    await api.deleteConversation(id, token);
    const updated = conversations.filter((c) => c._id !== id && c.id !== id);
    setConversations(updated);
    localStorage.setItem('neu_conversations', JSON.stringify(updated));

    if (activeId === id) {
      if (updated.length > 0) {
        selectConversation(updated[0]._id || updated[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  const sendMessage = async (userPrompt) => {
    if (!userPrompt || !userPrompt.trim() || isStreaming) return;

    const trimmed = userPrompt.trim();
    const userMessage = {
      _id: `u_${Date.now()}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString()
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsStreaming(true);
    setStreamingContent('');
    setStreamingReasoning('');

    const abortCtrl = new AbortController();
    abortControllerRef.current = abortCtrl;

    let assistantContent = '';
    let assistantReasoning = '';

    await streamChatCompletion({
      messages: nextMessages,
      conversationId: activeId,
      token,
      abortSignal: abortCtrl.signal,
      onDelta: (chunk, full) => {
        assistantContent = full;
        setStreamingContent(full);
      },
      onReasoningDelta: (chunk, full) => {
        assistantReasoning = full;
        setStreamingReasoning(full);
      },
      onDone: (result) => {
        const finalAssistant = {
          _id: `a_${Date.now()}`,
          role: 'assistant',
          content: result.content || assistantContent,
          reasoning: result.reasoning || assistantReasoning,
          reasoning_details: result.reasoning_details || [],
          usage: result.usage,
          createdAt: new Date().toISOString()
        };

        const finalMessages = [...nextMessages, finalAssistant];
        setMessages(finalMessages);
        setIsStreaming(false);
        setStreamingContent('');
        setStreamingReasoning('');
        abortControllerRef.current = null;

        // Update conversation title if needed
        setConversations((prev) => {
          const mapped = prev.map((c) => {
            if (c._id === activeId || c.id === activeId) {
              const updatedTitle =
                c.title === 'New Neumorphic Chat' || !c.title
                  ? trimmed.slice(0, 36) + (trimmed.length > 36 ? '...' : '')
                  : c.title;
              return {
                ...c,
                title: updatedTitle,
                updatedAt: new Date().toISOString(),
                messages: finalMessages
              };
            }
            return c;
          });
          localStorage.setItem('neu_conversations', JSON.stringify(mapped));
          return mapped;
        });
      },
      onError: (err) => {
        console.error('Chat stream error:', err);
        const errorMessage = {
          _id: `err_${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Error receiving response: ${err.message}. Please check your OpenRouter connection or try again.`,
          createdAt: new Date().toISOString()
        };
        setMessages([...nextMessages, errorMessage]);
        setIsStreaming(false);
        setStreamingContent('');
        setStreamingReasoning('');
        abortControllerRef.current = null;
      }
    });
  };

  const activeConversation = conversations.find((c) => c._id === activeId || c.id === activeId);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeId,
        activeConversation,
        messages,
        isStreaming,
        streamingContent,
        streamingReasoning,
        reasoningVisible,
        setReasoningVisible,
        searchQuery,
        setSearchQuery,
        selectConversation,
        createNewChat,
        deleteChat,
        sendMessage,
        stopStreaming
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
