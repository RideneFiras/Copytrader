import { User } from '../models/User.js';
import { Signal } from '../models/Signal.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { unauthorized, notFound } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import { signToken } from '../middlewares/auth.js';

export const adminAuth = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (password !== env.adminPassword) throw unauthorized('Invalid admin password');

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
  } else {
    admin.lastLoginAt = new Date();
    await admin.save();
  }

  const token = signToken(admin);
  res.json({ token, user: admin.toSafeJSON() });
});

export const listUsers = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  const filter = q
    ? { $or: [{ email: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') }] }
    : {};
  const users = await User.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  res.json({
    users: users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      isPremium: u.isPremium,
      premiumUntil: u.premiumUntil,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
    })),
  });
});

export const togglePremium = asyncHandler(async (req, res) => {
  const { isPremium, days } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw notFound('User not found');

  user.isPremium = isPremium;
  if (isPremium && days && days > 0) {
    const until = new Date();
    until.setDate(until.getDate() + days);
    user.premiumUntil = until;
  } else if (!isPremium) {
    user.premiumUntil = null;
  }
  await user.save();

  res.json({ user: user.toSafeJSON() });
});

export const adminStats = asyncHandler(async (_req, res) => {
  const [totalUsers, premiumUsers, totalSignals, openSignals] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isPremium: true }),
    Signal.countDocuments(),
    Signal.countDocuments({ status: 'open' }),
  ]);

  const [agg] = await Signal.aggregate([
    { $match: { status: 'closed' } },
    {
      $group: {
        _id: null,
        wins: { $sum: { $cond: [{ $eq: ['$result', 'win'] }, 1, 0] } },
        losses: { $sum: { $cond: [{ $eq: ['$result', 'loss'] }, 1, 0] } },
        totalPips: { $sum: '$pips' },
      },
    },
  ]);

  res.json({
    stats: {
      totalUsers,
      premiumUsers,
      totalSignals,
      openSignals,
      wins: agg?.wins || 0,
      losses: agg?.losses || 0,
      totalPips: Math.round(agg?.totalPips || 0),
      winRate:
        agg && agg.wins + agg.losses > 0
          ? Math.round((agg.wins / (agg.wins + agg.losses)) * 100)
          : 0,
    },
  });
});
