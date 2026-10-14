import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      default: ''
    },
    reasoning: {
      type: String,
      default: ''
    },
    reasoning_details: {
      type: Array,
      default: []
    },
    tokensUsed: {
      reasoningTokens: Number,
      promptTokens: Number,
      completionTokens: Number,
      totalTokens: Number
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    title: {
      type: String,
      default: 'New Neumorphic Chat'
    },
    model: {
      type: String,
      default: 'nvidia/nemotron-3-ultra-550b-a55b:free'
    },
    messages: [messageSchema]
  },
  { timestamps: true }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);
