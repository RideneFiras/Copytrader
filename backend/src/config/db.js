import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

mongoose.set('strictQuery', true);

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 50,
    });
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error({ err }, 'MongoDB connection failed');
    throw err;
  }
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});
