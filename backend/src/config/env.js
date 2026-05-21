import dotenv from 'dotenv';
dotenv.config();

const required = (name, fallback) => {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === null || v === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: required('MONGODB_URI', 'mongodb://localhost:27017/copytrader'),
  jwtSecret: required('JWT_SECRET', 'dev-secret-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminPassword: required('ADMIN_PASSWORD', 'admin1234'),
  clientOrigin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim()),
  goaiAffiliateUrl:
    process.env.GOAI_AFFILIATE_URL || 'https://goai.example.com/?ref=copytrader',
};

export const isProd = env.nodeEnv === 'production';
