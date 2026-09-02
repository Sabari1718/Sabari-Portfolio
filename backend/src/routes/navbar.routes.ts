import express from 'express';
import { getNavbarSettings, updateNavbarSettings } from '../controllers/navbar.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getNavbarSettings)
  .put(protect, admin, updateNavbarSettings);

export default router;
