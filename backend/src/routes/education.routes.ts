import express from 'express';
import { getEducation, createEducation, updateEducation, deleteEducation } from '../controllers/education.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getEducation)
  .post(protect, admin, createEducation);

router.route('/:id')
  .put(protect, admin, updateEducation)
  .delete(protect, admin, deleteEducation);

export default router;
