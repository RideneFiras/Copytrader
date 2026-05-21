import { Router } from 'express';
import { listSignals, getStats } from '../controllers/signalController.js';
import { authRequired } from '../middlewares/auth.js';

const router = Router();

router.get('/', authRequired, listSignals);
router.get('/stats', authRequired, getStats);

export default router;
