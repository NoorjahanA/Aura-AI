import mongoose from 'mongoose';
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
    const rawUserId = req.user?.id || null;

    if (getDBStatus()) {
      let query;
      if (rawUserId) {
        const objectId = mongoose.Types.ObjectId.isValid(rawUserId)
          ? new mongoose.Types.ObjectId(rawUserId)
          : null;
        query = objectId
          ? { $or: [{ userId: objectId }, { userId: rawUserId }] }
          : { userId: rawUserId };
      } else {
        query = { userId: null };
      }

      const convs = await Conversation.find(query)
        .select('_id title model updatedAt createdAt messages')
        .sort({ updatedAt: -1 });

      const mapped = convs.map((c) => ({
        _id: c._id,
        id: c._id,
        title: c.title,
        model: c.model,
        updatedAt: c.updatedAt,
        createdAt: c.createdAt,
        messageCount: c.messages?.length || 0
      }));
      return res.json(mapped);
    } else {
      const filtered = memoryConversations
        .filter((c) => (rawUserId ? String(c.userId) === String(rawUserId) : !c.userId))
        .map((c) => ({
          _id: c._id || c.id,
          id: c._id || c.id,
          title: c.title,
          model: c.model,
          updatedAt: c.updatedAt,
          createdAt: c.createdAt || c.updatedAt,
          messageCount: c.messages?.length || 0
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
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      const conv = await Conversation.findById(id);
      if (!conv) return res.status(404).json({ error: 'Conversation not found' });
      return res.json(conv);
    } else {
      const conv = memoryConversations.find((c) => c._id === id || c.id === id);
      if (!conv) return res.status(404).json({ error: 'Conversation not found' });
      return res.json(conv);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve conversation details' });
  }
};

export const createConversation = async (req, res) => {
  try {
    const rawUserId = req.user?.id || null;
    const userId =
      rawUserId && mongoose.Types.ObjectId.isValid(rawUserId)
        ? new mongoose.Types.ObjectId(rawUserId)
        : rawUserId;
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
        userId: rawUserId,
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
    console.error('Failed to create conversation:', err);
    res.status(500).json({ error: 'Failed to initialize conversation' });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Conversation.findByIdAndDelete(id);
      }
      return res.json({ success: true, message: 'Conversation deleted' });
    } else {
      memoryConversations = memoryConversations.filter((c) => c._id !== id && c.id !== id);
      return res.json({ success: true, message: 'Conversation deleted' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};

export const claimConversations = async (req, res) => {
  try {
    const rawUserId = req.user?.id;
    if (!rawUserId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const { conversationIds } = req.body;
    if (!conversationIds || !Array.isArray(conversationIds) || conversationIds.length === 0) {
      return res.status(400).json({ error: 'conversationIds array required' });
    }

    if (getDBStatus()) {
      const objectId = mongoose.Types.ObjectId.isValid(rawUserId)
        ? new mongoose.Types.ObjectId(rawUserId)
        : rawUserId;
      const validIds = conversationIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (validIds.length > 0) {
        await Conversation.updateMany(
          { _id: { $in: validIds }, userId: null },
          { $set: { userId: objectId } }
        );
      }
    } else {
      memoryConversations.forEach((c) => {
        if (conversationIds.includes(c._id || c.id) && !c.userId) {
          c.userId = rawUserId;
        }
      });
    }
    return res.json({ success: true, message: 'Conversations claimed successfully' });
  } catch (err) {
    console.error('Error claiming conversations:', err);
    res.status(500).json({ error: 'Failed to claim conversations' });
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
    const rawUserId = req.user?.id || null;
    const userId =
      rawUserId && mongoose.Types.ObjectId.isValid(rawUserId)
        ? new mongoose.Types.ObjectId(rawUserId)
        : rawUserId;

    try {
      const userLatestMessage = messages[messages.length - 1];
      const assistantMessageObj = {
        role: 'assistant',
        content: assistantContent,
        reasoning: assistantReasoning,
        reasoning_details:
          reasoningDetails.length > 0
            ? reasoningDetails
            : assistantReasoning
            ? [{ type: 'reasoning.text', text: assistantReasoning, index: 0 }]
            : [],
        createdAt: new Date()
      };

      if (getDBStatus()) {
        let conv = null;
        if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
          conv = await Conversation.findById(conversationId);
        }

        if (conv) {
          // If conversation belongs to no user but request has a user, claim it
          if (!conv.userId && userId) {
            conv.userId = userId;
          }
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

          if (conv.messages.length <= 3 && (!conv.title || conv.title === 'New Neumorphic Chat')) {
            conv.title =
              userLatestMessage.content.slice(0, 36) +
              (userLatestMessage.content.length > 36 ? '...' : '');
          }
          conv.updatedAt = new Date();
          await conv.save();
        } else {
          // Auto-create new conversation document in MongoDB so user history is never lost
          const newTitle = userLatestMessage?.content
            ? userLatestMessage.content.slice(0, 36) +
              (userLatestMessage.content.length > 36 ? '...' : '')
            : 'New Neumorphic Chat';
          await Conversation.create({
            userId,
            title: newTitle,
            model,
            messages: [
              {
                role: userLatestMessage.role,
                content: userLatestMessage.content,
                createdAt: new Date()
              },
              assistantMessageObj
            ]
          });
        }
      } else {
        // In-memory fallback
        let conv = null;
        if (conversationId) {
          conv = memoryConversations.find(
            (c) => c._id === conversationId || c.id === conversationId
          );
        }
        if (conv) {
          if (!conv.userId && rawUserId) {
            conv.userId = rawUserId;
          }
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
            conv.title =
              userLatestMessage.content.slice(0, 36) +
              (userLatestMessage.content.length > 36 ? '...' : '');
          }
          conv.updatedAt = new Date().toISOString();
        } else {
          const newConv = {
            _id: `conv_${Date.now()}`,
            id: `conv_${Date.now()}`,
            userId: rawUserId,
            title:
              userLatestMessage.content.slice(0, 36) +
              (userLatestMessage.content.length > 36 ? '...' : ''),
            model,
            messages: [
              {
                role: userLatestMessage.role,
                content: userLatestMessage.content,
                createdAt: new Date().toISOString()
              },
              {
                _id: `m_${Date.now()}`,
                ...assistantMessageObj,
                createdAt: new Date().toISOString()
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          memoryConversations.unshift(newConv);
        }
      }
    } catch (saveErr) {
      console.error('Error auto-saving conversation messages:', saveErr);
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
