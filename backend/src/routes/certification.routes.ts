import express from 'express';
import { getCertifications, createCertification, updateCertification, deleteCertification } from '../controllers/certification.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getCertifications)
  .post(protect, admin, createCertification);

router.route('/:id')
  .put(protect, admin, updateCertification)
  .delete(protect, admin, deleteCertification);

export default router;
