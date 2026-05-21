import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Signal } from '../models/Signal.js';
import { env } from '../config/env.js';
import { logger } from './logger.js';
import mongoose from 'mongoose';

async function seed() {
  await connectDB();

  // Admin user
  let admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    admin = new User({
      name: 'Admin',
      email: 'admin@copytrader.local',
      role: 'admin',
      isPremium: true,
    });
    await admin.setPassword(env.adminPassword);
    await admin.save();
    logger.info('Created admin@copytrader.local');
  }

  // Demo user
  let demo = await User.findOne({ email: 'demo@copytrader.local' });
  if (!demo) {
    demo = new User({
      name: 'Demo Trader',
      email: 'demo@copytrader.local',
      isPremium: false,
    });
    await demo.setPassword('demopass123');
    await demo.save();
    logger.info('Created demo@copytrader.local / demopass123');
  }

  // Sample signals
  const count = await Signal.countDocuments();
  if (count === 0) {
    const now = new Date();
    const day = (d) => new Date(now.getTime() - d * 86400000);

    await Signal.insertMany([
      {
        asset: 'XAUUSD',
        direction: 'BUY',
        entry: 2345.5,
        takeProfit: 2360.0,
        stopLoss: 2335.0,
        note: 'Bullish breakout above key resistance.',
        status: 'open',
        result: 'pending',
        publishedAt: now,
        isPremiumOnly: false,
      },
      {
        asset: 'XAUUSD',
        direction: 'SELL',
        entry: 2370.0,
        takeProfit: 2350.0,
        stopLoss: 2380.0,
        note: 'Premium swing setup.',
        status: 'open',
        result: 'pending',
        publishedAt: now,
        isPremiumOnly: true,
      },
      {
        asset: 'EURUSD',
        direction: 'BUY',
        entry: 1.085,
        takeProfit: 1.092,
        stopLoss: 1.082,
        status: 'closed',
        result: 'win',
        pips: 70,
        publishedAt: day(1),
      },
      {
        asset: 'BTCUSD',
        direction: 'SELL',
        entry: 67500,
        takeProfit: 66200,
        stopLoss: 68200,
        status: 'closed',
        result: 'win',
        pips: 130,
        publishedAt: day(2),
      },
      {
        asset: 'XAUUSD',
        direction: 'BUY',
        entry: 2310,
        takeProfit: 2330,
        stopLoss: 2300,
        status: 'closed',
        result: 'loss',
        pips: -100,
        publishedAt: day(3),
      },
      {
        asset: 'GBPUSD',
        direction: 'BUY',
        entry: 1.272,
        takeProfit: 1.28,
        stopLoss: 1.268,
        status: 'closed',
        result: 'win',
        pips: 80,
        publishedAt: day(4),
      },
    ]);
    logger.info('Seeded sample signals');
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  logger.error({ err }, 'Seed failed');
  process.exit(1);
});
