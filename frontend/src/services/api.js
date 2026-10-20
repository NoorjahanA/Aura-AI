const SERVER_URL = import.meta.env.VITE_API_URL || 'https://aura-ai-c4df.onrender.com';
const API_BASE = `${SERVER_URL}/api`;

const DEFAULT_CONVERSATION = {
  _id: 'conv_default',
  id: 'conv_default',
  title: 'Welcome & System Overview',
  model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
  updatedAt: new Date().toISOString(),
  messages: [
    {
      _id: 'm_welcome',
      role: 'assistant',
      content: 'Welcome to this Neumorphic AI workspace. This interface features tactile neumorphic controls, smooth dark and light themes, and deep step-by-step reasoning.\n\nTry asking me a question or logic problem to inspect the reasoning process!',
      reasoning: 'Greet the user, outline system capabilities, and encourage testing reasoning capabilities.',

      reasoning_details: [
        {
          type: 'reasoning.text',
          text: 'Greet the user, outline system architecture, and encourage testing reasoning capabilities.',
          format: 'unknown',
          index: 0
        }
      ],
      createdAt: new Date().toISOString()
    }
  ]
};

export const api = {
  async getConversations(token) {
    try {
      const res = await fetch(`${API_BASE}/conversations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Failed to load conversations from server');
      return await res.json();
    } catch {
      // Local storage fallback
      const stored = localStorage.getItem('neu_conversations');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
      return [DEFAULT_CONVERSATION];
    }
  },

  async getConversation(id, token) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Failed to load conversation');
      return await res.json();
    } catch {
      const stored = localStorage.getItem('neu_conversations');
      if (stored) {
        const list = JSON.parse(stored);
        const found = list.find((c) => c._id === id || c.id === id);
        if (found) return found;
      }
      return DEFAULT_CONVERSATION;
    }
  },

  async createConversation(data, token) {
    try {
      const res = await fetch(`${API_BASE}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create conversation');
      return await res.json();
    } catch {
      const newConv = {
        _id: `conv_${Date.now()}`,
        id: `conv_${Date.now()}`,
        title: data?.title || 'New Neumorphic Chat',
        model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return newConv;
    }
  },

  async deleteConversation(id, token) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  async claimConversations(conversationIds, token) {
    if (!token || !conversationIds || conversationIds.length === 0) return;
    try {
      await fetch(`${API_BASE}/conversations/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ conversationIds })
      });
    } catch (err) {
      console.warn('Failed to claim conversations:', err);
    }
  }
};
