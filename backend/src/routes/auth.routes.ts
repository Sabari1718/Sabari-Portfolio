import express from 'express';
import { login, getMe, setupAdmin } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/login', login);
router.post('/setup', setupAdmin); // Creates the first admin user
router.get('/me', protect, getMe);

export default router;
