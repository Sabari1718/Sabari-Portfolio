import { Request, Response } from 'express';
import pool from '../config/database';

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
export const submitContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Name is required' });
      return;
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ success: false, message: 'A valid email address is required' });
      return;
    }
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }
    if (message.trim().length > 5000) {
      res.status(400).json({ success: false, message: 'Message must be less than 5000 characters' });
      return;
    }

    const query = `
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `;
    
    await pool.query(query, [
      name.trim().substring(0, 255),
      email.trim().toLowerCase().substring(0, 255),
      subject?.trim().substring(0, 255) || '',
      message.trim()
    ]);
    
    res.status(201).json({ success: true, message: 'Message sent successfully! I\'ll get back to you soon.' });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ success: false, message: 'Server Error submitting message' });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin)
export const getContactMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const [messages] = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching messages' });
  }
};

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
// @access  Private (Admin)
export const markMessageAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ success: false, message: 'Invalid message ID' });
      return;
    }
    
    const [result] = await pool.query(
      'UPDATE contact_messages SET is_read = TRUE WHERE id = ?',
      [id]
    );
    
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }
    
    res.status(200).json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ success: false, message: 'Server Error updating message status' });
  }
};

// @desc    Delete a message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ success: false, message: 'Invalid message ID' });
      return;
    }
    
    const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }
    
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, message: 'Server Error deleting message' });
  }
};
