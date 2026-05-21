import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function main() {
  await connectDB();
  const app = createApp();

  const server = app.listen(env.port, () => {
    logger.info(`Copytrader API listening on :${env.port} (${env.nodeEnv})`);
  });

  const shutdown = (signal) => () => {
    logger.info(`${signal} received — shutting down`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGTERM', shutdown('SIGTERM'));
  process.on('SIGINT', shutdown('SIGINT'));
  process.on('unhandledRejection', (err) => {
    logger.error({ err }, 'unhandledRejection');
  });
}

main().catch((err) => {
  logger.error({ err }, 'Fatal startup error');
  process.exit(1);
});
