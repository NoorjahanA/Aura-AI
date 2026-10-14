import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_chatbot';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Connection notice: Unable to connect to local MongoDB (${error.message}).`);
    console.warn(`[MongoDB] Server will operate gracefully with in-memory persistence fallback.`);
    return false;
  }
};

export const getDBStatus = () => isConnected;
