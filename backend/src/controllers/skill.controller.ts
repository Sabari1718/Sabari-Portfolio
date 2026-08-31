import { Request, Response } from 'express';
import pool from '../config/database';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const [skills] = await pool.query(
      'SELECT * FROM skills ORDER BY display_order ASC, category ASC, name ASC'
    );
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching skills' });
  }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private (Admin)
export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, proficiency, icon, display_order } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Skill name is required' });
      return;
    }

    const safeProficiency = proficiency !== undefined ? Math.min(100, Math.max(0, Number(proficiency))) : 80;

    const query = `
      INSERT INTO skills (name, category, proficiency, icon, display_order)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      name.trim(),
      category?.trim() ?? null,
      safeProficiency,
      icon?.trim() ?? null,
      display_order ?? 0
    ]);
    
    const insertId = (result as any).insertId;
    res.status(201).json({ success: true, message: 'Skill created successfully', data: { id: insertId } });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ success: false, message: 'Server Error creating skill' });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private (Admin)
export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, category, proficiency, icon, display_order } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Skill name is required' });
      return;
    }

    const safeProficiency = proficiency !== undefined ? Math.min(100, Math.max(0, Number(proficiency))) : 80;

    const query = `
      UPDATE skills 
      SET name = ?, category = ?, proficiency = ?, icon = ?, display_order = ?
      WHERE id = ?
    `;
    
    const [result] = await pool.query(query, [
      name.trim(),
      category?.trim() ?? null,
      safeProficiency,
      icon?.trim() ?? null,
      display_order ?? 0,
      id
    ]);
    
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Skill not found' });
      return;
    }
    
    res.status(200).json({ success: true, message: 'Skill updated successfully' });
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ success: false, message: 'Server Error updating skill' });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private (Admin)
export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ success: false, message: 'Invalid skill ID' });
      return;
    }

    const [result] = await pool.query('DELETE FROM skills WHERE id = ?', [id]);
    
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Skill not found' });
      return;
    }
    
    res.status(200).json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ success: false, message: 'Server Error deleting skill' });
  }
};
