import express from 'express';
import { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '../controllers/social.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getSocialLinks)
  .post(protect, admin, createSocialLink);

router.route('/:id')
  .put(protect, admin, updateSocialLink)
  .delete(protect, admin, deleteSocialLink);

export default router;
