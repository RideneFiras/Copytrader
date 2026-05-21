import { Router } from 'express';
import {
  adminAuth,
  listUsers,
  togglePremium,
  adminStats,
} from '../controllers/adminController.js';
import {
  createSignal,
  updateSignal,
  deleteSignal,
} from '../controllers/signalController.js';
import { authRequired, adminOnly } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  adminAuthSchema,
  signalSchema,
  signalUpdateSchema,
  togglePremiumSchema,
} from '../validators/schemas.js';
import { adminLoginLimiter } from '../middlewares/rateLimit.js';

const router = Router();

router.post('/auth', adminLoginLimiter, validate(adminAuthSchema), adminAuth);

router.use(authRequired, adminOnly);

router.get('/stats', adminStats);
router.get('/users', listUsers);
router.patch('/users/:id/premium', validate(togglePremiumSchema), togglePremium);

router.post('/signals', validate(signalSchema), createSignal);
router.patch('/signals/:id', validate(signalUpdateSchema), updateSignal);
router.delete('/signals/:id', deleteSignal);

export default router;
