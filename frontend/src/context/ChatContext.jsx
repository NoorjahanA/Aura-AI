import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../services/api.js';
import { streamChatCompletion } from '../services/openRouterService.js';
import { useAuth } from './AuthContext.jsx';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingReasoning, setStreamingReasoning] = useState('');
  const [reasoningVisible, setReasoningVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const abortControllerRef = useRef(null);
  const userWasLoggedInRef = useRef(Boolean(token));

  // Initialize or switch conversations when user or token changes
  useEffect(() => {
    loadConversations();
  }, [token, user?.id]);

  const loadConversations = async () => {
    try {
      // If user just logged in and had an active guest conversation, claim it for this user in MongoDB!
      if (token && activeId && !userWasLoggedInRef.current) {
        try {
          await api.claimConversations([activeId], token);
        } catch (cErr) {
          console.warn('Could not claim previous session chat:', cErr);
        }
      }
      userWasLoggedInRef.current = Boolean(token);

      const list = await api.getConversations(token);
      setConversations(list);

      if (list && list.length > 0) {
        // If current activeId belongs to this user's list, keep it; otherwise select latest
        const currentInList = list.find((c) => (c._id || c.id) === activeId);
        if (currentInList) {
          selectConversation(activeId);
        } else {
          selectConversation(list[0]._id || list[0].id);
        }
      } else {
        // User has 0 previous conversations: clean slate
        setActiveId(null);
        setMessages([]);
        setStreamingContent('');
        setStreamingReasoning('');
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setConversations([]);
      setActiveId(null);
      setMessages([]);
    }
  };

  const selectConversation = async (id) => {
    if (!id) return;
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
      // Find in existing state
      const local = conversations.find((c) => (c._id === id || c.id === id));
      setMessages(local?.messages || []);
    }
  };

  const createNewChat = async () => {
    if (isStreaming) {
      stopStreaming();
    }
    const newConv = await api.createConversation({ title: 'New Neumorphic Chat' }, token);
    const newId = newConv._id || newConv.id;
    setConversations((prev) => [newConv, ...prev.filter((c) => (c._id || c.id) !== newId)]);
    setActiveId(newId);
    setMessages([]);
    setStreamingContent('');
    setStreamingReasoning('');
  };

  const deleteChat = async (id, e) => {
    e?.stopPropagation();
    await api.deleteConversation(id, token);
    const updated = conversations.filter((c) => c._id !== id && c.id !== id);
    setConversations(updated);

    if (activeId === id) {
      if (updated.length > 0) {
        selectConversation(updated[0]._id || updated[0].id);
      } else {
        setActiveId(null);
        setMessages([]);
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
    let currentConvId = activeId;

    // If no active conversation exists, create one right now in MongoDB/backend
    if (!currentConvId) {
      try {
        const initialTitle = trimmed.slice(0, 36) + (trimmed.length > 36 ? '...' : '');
        const created = await api.createConversation({ title: initialTitle }, token);
        currentConvId = created._id || created.id;
        setActiveId(currentConvId);
        setConversations((prev) => [created, ...prev.filter((c) => (c._id || c.id) !== currentConvId)]);
      } catch (cErr) {
        console.error('Failed to pre-create conversation:', cErr);
      }
    }

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
      conversationId: currentConvId,
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

        // Ensure conversation is in sidebar list and title updated
        setConversations((prev) => {
          const updatedTitle = trimmed.slice(0, 36) + (trimmed.length > 36 ? '...' : '');
          const exists = prev.some((c) => (c._id || c.id) === currentConvId);

          if (!exists && currentConvId) {
            return [
              {
                _id: currentConvId,
                id: currentConvId,
                title: updatedTitle,
                updatedAt: new Date().toISOString(),
                messages: finalMessages
              },
              ...prev
            ];
          }

          return prev.map((c) => {
            if ((c._id || c.id) === currentConvId) {
              return {
                ...c,
                title: c.title === 'New Neumorphic Chat' || !c.title ? updatedTitle : c.title,
                updatedAt: new Date().toISOString(),
                messages: finalMessages
              };
            }
            return c;
          });
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

  const activeConversation = conversations.find((c) => (c._id || c.id) === activeId);

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
