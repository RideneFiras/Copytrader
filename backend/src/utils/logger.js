import pino from 'pino';
import { isProd } from '../config/env.js';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  transport: isProd
    ? undefined
    : {
        target: 'pino/file',
        options: { destination: 1 },
      },
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
});
