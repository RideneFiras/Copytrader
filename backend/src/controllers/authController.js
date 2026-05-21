import { User } from '../models/User.js';
import { signToken } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { conflict, unauthorized } from '../utils/ApiError.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email }).lean();
  if (exists) throw conflict('Email already registered');

  const user = new User({ name, email });
  await user.setPassword(password);
  await user.save();

  const token = signToken(user);
  res.status(201).json({ token, user: user.toSafeJSON() });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw unauthorized('Invalid credentials');

  const ok = await user.verifyPassword(password);
  if (!ok) throw unauthorized('Invalid credentials');

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(user);
  res.json({ token, user: user.toSafeJSON() });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw unauthorized('User not found');
  res.json({ user: user.toSafeJSON() });
});
