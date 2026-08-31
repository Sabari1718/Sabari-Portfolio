import { Request, Response } from 'express';
import pool from '../config/database';

export const getSocialLinks = async (req: Request, res: Response): Promise<void> => {
  try {
    const [socialLinks] = await pool.query('SELECT * FROM social_links');
    res.status(200).json({ success: true, data: socialLinks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error fetching social links' });
  }
};

export const createSocialLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { platform, url, icon } = req.body;
    const query = `INSERT INTO social_links (platform, url, icon) VALUES (?, ?, ?)`;
    const [result] = await pool.query(query, [platform, url, icon]);
    const insertId = (result as any).insertId;
    res.status(201).json({ success: true, message: 'Social link created successfully', data: { id: insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error creating social link' });
  }
};

export const updateSocialLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { platform, url, icon } = req.body;
    const query = `UPDATE social_links SET platform = ?, url = ?, icon = ? WHERE id = ?`;
    const [result] = await pool.query(query, [platform, url, icon, id]);
    if ((result as any).affectedRows === 0) { res.status(404).json({ success: false, message: 'Social link not found' }); return; }
    res.status(200).json({ success: true, message: 'Social link updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error updating social link' });
  }
};

export const deleteSocialLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM social_links WHERE id = ?', [id]);
    if ((result as any).affectedRows === 0) { res.status(404).json({ success: false, message: 'Social link not found' }); return; }
    res.status(200).json({ success: true, message: 'Social link deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error deleting social link' });
  }
};
