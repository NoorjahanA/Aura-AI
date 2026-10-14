import express from 'express';
import {
  getConversations,
  getConversationById,
  createConversation,
  deleteConversation,
  streamChat
} from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:id', getConversationById);
router.delete('/conversations/:id', deleteConversation);
router.post('/chat/stream', streamChat);

export default router;
