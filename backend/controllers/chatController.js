import { Conversation } from '../models/Conversation.js';
import { getDBStatus } from '../config/db.js';

// In-memory conversations store fallback
let memoryConversations = [
  {
    _id: 'conv_welcome',
    id: 'conv_welcome',
    userId: null,
    title: 'Welcome & System Overview',
    model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    updatedAt: new Date().toISOString(),
    messages: [
      {
        _id: 'm1',
        role: 'assistant',
        content: 'Greetings. I am your Minimalist Neumorphic AI assistant. I support deep step-by-step reasoning tokens, conversational continuity, and sleek tactile aesthetics. How can I assist your workflow today?',
        reasoning: 'Greet the user warmly, summarize system capabilities including step-by-step reasoning and neumorphic design, and invite an initial inquiry.',
        reasoning_details: [
          {
            type: 'reasoning.text',
            text: 'Greet the user warmly, summarize system capabilities including step-by-step reasoning and neumorphic design, and invite an initial inquiry.',

            format: 'unknown',
            index: 0
          }
        ],
        createdAt: new Date().toISOString()
      }
    ]
  }
];

export const getConversations = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    if (getDBStatus()) {
      const query = userId ? { userId } : { userId: null };
      const convs = await Conversation.find(query)
        .select('_id title model updatedAt createdAt')
        .sort({ updatedAt: -1 });
      return res.json(convs);
    } else {
      const filtered = memoryConversations
        .filter((c) => (userId ? c.userId === userId : true))
        .map((c) => ({
          _id: c._id || c.id,
          id: c._id || c.id,
          title: c.title,
          model: c.model,
          updatedAt: c.updatedAt,
          createdAt: c.createdAt || c.updatedAt
        }))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      return res.json(filtered);
    }
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'Failed to retrieve conversations' });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const conv = await Conversation.findById(id);
      if (!conv) return res.status(404).json({ error: 'Conversation not found' });
      return res.json(conv);
    } else {
      const conv = memoryConversations.find((c) => (c._id === id || c.id === id));
      if (!conv) return res.status(404).json({ error: 'Conversation not found' });
      return res.json(conv);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve conversation details' });
  }
};

export const createConversation = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { title, model } = req.body;

    const chosenTitle = title || 'New Neumorphic Chat';
    const chosenModel = model || process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free';

    if (getDBStatus()) {
      const conv = await Conversation.create({
        userId,
        title: chosenTitle,
        model: chosenModel,
        messages: []
      });
      return res.status(201).json(conv);
    } else {
      const newConv = {
        _id: `conv_${Date.now()}`,
        id: `conv_${Date.now()}`,
        userId,
        title: chosenTitle,
        model: chosenModel,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryConversations.unshift(newConv);
      return res.status(201).json(newConv);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to initialize conversation' });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      await Conversation.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Conversation deleted' });
    } else {
      memoryConversations = memoryConversations.filter((c) => c._id !== id && c.id !== id);
      return res.json({ success: true, message: 'Conversation deleted' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};

// Stream Chat via OpenRouter API with Reasoning Details
export const streamChat = async (req, res) => {
  try {
    const { conversationId, messages, stream = true } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free';

    if (!apiKey) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured on server' });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    // Format messages for OpenRouter: preserve reasoning_details when present
    const formattedMessages = messages.map((m) => {
      const item = {
        role: m.role,
        content: m.content
      };
      if (m.reasoning_details && Array.isArray(m.reasoning_details) && m.reasoning_details.length > 0) {
        item.reasoning_details = m.reasoning_details;
      }
      return item;
    });

    // Request payload to OpenRouter
    const openRouterPayload = {
      model,
      messages: formattedMessages,
      stream: Boolean(stream)
    };

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
        'X-Title': 'Minimal Neumorphic AI Chatbot'
      },
      body: JSON.stringify(openRouterPayload)
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API Error:', openRouterResponse.status, errorText);
      return res.status(openRouterResponse.status).json({
        error: `OpenRouter returned status ${openRouterResponse.status}`,
        details: errorText
      });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const reader = openRouterResponse.body.getReader();
    const decoder = new TextDecoder();
    let assistantContent = '';
    let assistantReasoning = '';
    let reasoningDetails = [];

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep partial trailing line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Skip OpenRouter keepalive comments like ": OPENROUTER PROCESSING"
        if (trimmed.startsWith(':')) {
          res.write(`${trimmed}\n\n`);
          continue;
        }

        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6).trim();

          if (dataStr === '[DONE]') {
            res.write(`data: [DONE]\n\n`);
            continue;
          }

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta;

            if (delta?.content) {
              assistantContent += delta.content;
            }

            if (delta?.reasoning) {
              assistantReasoning += delta.reasoning;
            }

            if (delta?.reasoning_details) {
              reasoningDetails = delta.reasoning_details;
            }

            // Forward the chunk to the client
            res.write(`data: ${JSON.stringify(parsed)}\n\n`);
          } catch (pErr) {
            // Forward raw if parsing is not needed
            res.write(`${trimmed}\n\n`);
          }
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

    // Persist messages to conversation asynchronously
    if (conversationId) {
      try {
        const userLatestMessage = messages[messages.length - 1];
        const assistantMessageObj = {
          role: 'assistant',
          content: assistantContent,
          reasoning: assistantReasoning,
          reasoning_details: reasoningDetails.length > 0 ? reasoningDetails : (assistantReasoning ? [{ type: 'reasoning.text', text: assistantReasoning, index: 0 }] : []),
          createdAt: new Date()
        };

        if (getDBStatus()) {
          const conv = await Conversation.findById(conversationId);
          if (conv) {
            // Check if user message is already stored
            const alreadyHasUser = conv.messages.some(
              (m) => m.role === 'user' && m.content === userLatestMessage.content
            );
            if (!alreadyHasUser) {
              conv.messages.push({
                role: userLatestMessage.role,
                content: userLatestMessage.content,
                createdAt: new Date()
              });
            }
            conv.messages.push(assistantMessageObj);

            // Auto-update conversation title if it's new
            if (conv.messages.length <= 3 && (!conv.title || conv.title === 'New Neumorphic Chat')) {
              conv.title = userLatestMessage.content.slice(0, 36) + (userLatestMessage.content.length > 36 ? '...' : '');
            }
            conv.updatedAt = new Date();
            await conv.save();
          }
        } else {
          const conv = memoryConversations.find((c) => (c._id === conversationId || c.id === conversationId));
          if (conv) {
            const alreadyHasUser = conv.messages.some(
              (m) => m.role === 'user' && m.content === userLatestMessage.content
            );
            if (!alreadyHasUser) {
              conv.messages.push({
                role: userLatestMessage.role,
                content: userLatestMessage.content,
                createdAt: new Date().toISOString()
              });
            }
            conv.messages.push({
              _id: `m_${Date.now()}`,
              ...assistantMessageObj,
              createdAt: new Date().toISOString()
            });

            if (conv.messages.length <= 3 && (!conv.title || conv.title === 'New Neumorphic Chat')) {
              conv.title = userLatestMessage.content.slice(0, 36) + (userLatestMessage.content.length > 36 ? '...' : '');
            }
            conv.updatedAt = new Date().toISOString();
          }
        }
      } catch (saveErr) {
        console.error('Error auto-saving conversation messages:', saveErr);
      }
    }
  } catch (err) {
    console.error('Error during chat stream:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Streaming error: ' + err.message });
    } else {
      res.end();
    }
  }
};
