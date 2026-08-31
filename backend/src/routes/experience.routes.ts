import express from 'express';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../controllers/experience.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getExperiences)
  .post(protect, admin, createExperience);

router.route('/:id')
  .put(protect, admin, updateExperience)
  .delete(protect, admin, deleteExperience);

export default router;
