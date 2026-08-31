import express from 'express';
import { submitContactMessage, getContactMessages, markMessageAsRead, deleteMessage } from '../controllers/contact.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// Public route to submit messages
router.route('/')
  .post(submitContactMessage)
  .get(protect, admin, getContactMessages); 

router.route('/:id/read')
  .put(protect, admin, markMessageAsRead); 

router.route('/:id')
  .delete(protect, admin, deleteMessage); 

export default router;
