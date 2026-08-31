import express from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getProfile)
  .put(protect, admin, updateProfile);

export default router;
