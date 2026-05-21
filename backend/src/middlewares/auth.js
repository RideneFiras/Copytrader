import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { unauthorized, forbidden } from '../utils/ApiError.js';

export function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export async function authRequired(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next(unauthorized('Missing token'));

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.sub).lean();
    if (!user) return next(unauthorized('User not found'));

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
      premiumUntil: user.premiumUntil,
      name: user.name,
    };
    next();
  } catch (err) {
    return next(unauthorized('Invalid or expired token'));
  }
}

export function adminOnly(req, _res, next) {
  if (req.user?.role !== 'admin') return next(forbidden('Admin access required'));
  next();
}
