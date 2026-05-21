import { Router } from 'express';
import authRoutes from './auth.routes.js';
import signalRoutes from './signal.routes.js';
import adminRoutes from './admin.routes.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

router.get('/affiliate', (_req, res) => {
  res.json({ url: env.goaiAffiliateUrl });
});

router.use('/auth', authRoutes);
router.use('/signals', signalRoutes);
router.use('/admin', adminRoutes);

export default router;
