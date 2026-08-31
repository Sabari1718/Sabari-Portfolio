import { Request, Response } from 'express';
import pool from '../config/database';

export const getCertifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const [certifications] = await pool.query('SELECT * FROM certifications ORDER BY issue_date DESC');
    res.status(200).json({ success: true, data: certifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error fetching certifications' });
  }
};

export const createCertification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, issuer, issue_date, credential_url } = req.body;
    const query = `INSERT INTO certifications (title, issuer, issue_date, credential_url) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.query(query, [title, issuer, issue_date, credential_url]);
    const insertId = (result as any).insertId;
    res.status(201).json({ success: true, message: 'Certification created successfully', data: { id: insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error creating certification' });
  }
};

export const updateCertification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, issuer, issue_date, credential_url } = req.body;
    const query = `UPDATE certifications SET title = ?, issuer = ?, issue_date = ?, credential_url = ? WHERE id = ?`;
    const [result] = await pool.query(query, [title, issuer, issue_date, credential_url, id]);
    if ((result as any).affectedRows === 0) { res.status(404).json({ success: false, message: 'Certification not found' }); return; }
    res.status(200).json({ success: true, message: 'Certification updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error updating certification' });
  }
};

export const deleteCertification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM certifications WHERE id = ?', [id]);
    if ((result as any).affectedRows === 0) { res.status(404).json({ success: false, message: 'Certification not found' }); return; }
    res.status(200).json({ success: true, message: 'Certification deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error deleting certification' });
  }
};
