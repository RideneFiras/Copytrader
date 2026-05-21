import { Signal } from '../models/Signal.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notFound } from '../utils/ApiError.js';

const isPremiumActive = (user) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (!user.isPremium) return false;
  if (!user.premiumUntil) return true;
  return new Date(user.premiumUntil) > new Date();
};

export const listSignals = asyncHandler(async (req, res) => {
  const premium = isPremiumActive(req.user);
  const limit = Math.min(Number(req.query.limit) || 50, 100);

  const query = Signal.find().sort({ publishedAt: -1 }).limit(limit).lean();
  const signals = await query;

  // Free users see only 1 most-recent free signal of today; premium-only ones are obfuscated
  if (!premium) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let freeCount = 0;
    const masked = signals.map((s) => {
      const isToday = new Date(s.publishedAt) >= today;
      const isFree = !s.isPremiumOnly && isToday && freeCount < 1;
      if (isFree) {
        freeCount += 1;
        return { ...s, locked: false };
      }
      return {
        _id: s._id,
        asset: s.asset,
        direction: s.direction,
        publishedAt: s.publishedAt,
        status: s.status,
        result: s.result,
        isPremiumOnly: s.isPremiumOnly,
        locked: true,
      };
    });
    return res.json({ signals: masked, premium: false });
  }

  res.json({ signals: signals.map((s) => ({ ...s, locked: false })), premium: true });
});

export const getStats = asyncHandler(async (_req, res) => {
  const [agg] = await Signal.aggregate([
    { $match: { status: 'closed', result: { $in: ['win', 'loss', 'breakeven'] } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        wins: { $sum: { $cond: [{ $eq: ['$result', 'win'] }, 1, 0] } },
        losses: { $sum: { $cond: [{ $eq: ['$result', 'loss'] }, 1, 0] } },
        breakeven: { $sum: { $cond: [{ $eq: ['$result', 'breakeven'] }, 1, 0] } },
        totalPips: { $sum: '$pips' },
      },
    },
  ]);

  const totalSignals = await Signal.countDocuments();
  const openCount = await Signal.countDocuments({ status: 'open' });

  const stats = {
    totalSignals,
    openCount,
    closedCount: agg?.total || 0,
    wins: agg?.wins || 0,
    losses: agg?.losses || 0,
    breakeven: agg?.breakeven || 0,
    totalPips: Math.round(agg?.totalPips || 0),
    winRate:
      agg && agg.total > 0
        ? Math.round((agg.wins / Math.max(agg.wins + agg.losses, 1)) * 100)
        : 0,
  };

  res.json({ stats });
});

export const createSignal = asyncHandler(async (req, res) => {
  const signal = await Signal.create(req.body);
  res.status(201).json({ signal });
});

export const updateSignal = asyncHandler(async (req, res) => {
  const signal = await Signal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!signal) throw notFound('Signal not found');
  res.json({ signal });
});

export const deleteSignal = asyncHandler(async (req, res) => {
  const out = await Signal.findByIdAndDelete(req.params.id);
  if (!out) throw notFound('Signal not found');
  res.json({ ok: true });
});
