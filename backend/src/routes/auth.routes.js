import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';
import { authLimiter } from '../middlewares/rateLimit.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', authRequired, me);

export default router;
