import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export const signalSchema = z.object({
  asset: z.string().min(2).max(20).toUpperCase(),
  direction: z.enum(['BUY', 'SELL']),
  entry: z.number().finite().positive(),
  takeProfit: z.number().finite().positive(),
  stopLoss: z.number().finite().positive(),
  note: z.string().max(500).optional().default(''),
  isPremiumOnly: z.boolean().optional().default(false),
  publishedAt: z.coerce.date().optional(),
});

export const signalUpdateSchema = signalSchema.partial().extend({
  status: z.enum(['open', 'closed']).optional(),
  result: z.enum(['pending', 'win', 'loss', 'breakeven']).optional(),
  pips: z.number().finite().optional(),
});

export const adminAuthSchema = z.object({
  password: z.string().min(1),
});

export const togglePremiumSchema = z.object({
  isPremium: z.boolean(),
  days: z.number().int().min(0).max(365).optional(),
});
