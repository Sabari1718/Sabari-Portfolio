import { Request, Response } from 'express';
import pool from '../config/database';

// @desc    Get all experiences
// @route   GET /api/experience
// @access  Public
export const getExperiences = async (req: Request, res: Response): Promise<void> => {
  try {
    const [experiences] = await pool.query(
      'SELECT * FROM experiences ORDER BY display_order ASC, start_date DESC'
    );
    res.status(200).json({ success: true, data: experiences });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching experiences' });
  }
};

// @desc    Create an experience
// @route   POST /api/experience
// @access  Private (Admin)
export const createExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      company, logo_url, role, description, technologies,
      start_date, end_date, currently_working, location, display_order
    } = req.body;

    if (!company || typeof company !== 'string' || company.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Company name is required' });
      return;
    }
    if (!role || typeof role !== 'string' || role.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Role is required' });
      return;
    }
    if (!start_date) {
      res.status(400).json({ success: false, message: 'Start date is required' });
      return;
    }

    const isCurrently = currently_working === true || currently_working === 'true';

    const query = `
      INSERT INTO experiences 
        (company, logo_url, role, description, technologies, start_date, end_date, currently_working, location, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      company.trim(),
      logo_url?.trim() ?? null,
      role.trim(),
      description?.trim() ?? null,
      technologies?.trim() ?? null,
      start_date,
      isCurrently ? null : (end_date || null),
      isCurrently ? 1 : 0,
      location?.trim() ?? null,
      display_order ?? 0
    ]);
    
    const insertId = (result as any).insertId;
    res.status(201).json({ success: true, message: 'Experience created successfully', data: { id: insertId } });
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ success: false, message: 'Server Error creating experience' });
  }
};

// @desc    Update an experience
// @route   PUT /api/experience/:id
// @access  Private (Admin)
export const updateExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      company, logo_url, role, description, technologies,
      start_date, end_date, currently_working, location, display_order
    } = req.body;

    if (!company || typeof company !== 'string' || company.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Company name is required' });
      return;
    }
    if (!role || typeof role !== 'string' || role.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Role is required' });
      return;
    }

    const isCurrently = currently_working === true || currently_working === 'true';

    const query = `
      UPDATE experiences 
      SET company = ?, logo_url = ?, role = ?, description = ?, technologies = ?,
          start_date = ?, end_date = ?, currently_working = ?, location = ?, display_order = ?
      WHERE id = ?
    `;
    
    const [result] = await pool.query(query, [
      company.trim(),
      logo_url?.trim() ?? null,
      role.trim(),
      description?.trim() ?? null,
      technologies?.trim() ?? null,
      start_date || null,
      isCurrently ? null : (end_date || null),
      isCurrently ? 1 : 0,
      location?.trim() ?? null,
      display_order ?? 0,
      id
    ]);
    
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Experience not found' });
      return;
    }
    
    res.status(200).json({ success: true, message: 'Experience updated successfully' });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ success: false, message: 'Server Error updating experience' });
  }
};

// @desc    Delete an experience
// @route   DELETE /api/experience/:id
// @access  Private (Admin)
export const deleteExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ success: false, message: 'Invalid experience ID' });
      return;
    }

    const [result] = await pool.query('DELETE FROM experiences WHERE id = ?', [id]);
    
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Experience not found' });
      return;
    }
    
    res.status(200).json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ success: false, message: 'Server Error deleting experience' });
  }
};
