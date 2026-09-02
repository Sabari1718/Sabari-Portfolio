import { Request, Response } from 'express';
import pool from '../config/database';

// @desc    Get Navbar Settings
// @route   GET /api/navbar
// @access  Public
export const getNavbarSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM navbar_settings LIMIT 1');
    const settings = rows as any[];
    
    if (settings.length === 0) {
      // Return defaults if not configured
      res.status(200).json({
        success: true,
        data: {
          logo_name: 'Sabari Portfolio',
          about_label: 'About',
          projects_label: 'Projects',
          skills_label: 'Skills',
          contact_label: 'Contact',
          show_about: true,
          show_projects: true,
          show_skills: true,
          show_contact: true
        }
      });
      return;
    }
    
    // Cast MySQL tinyint (boolean) back to actual booleans for the frontend
    const data = settings[0];
    res.status(200).json({
      success: true,
      data: {
        ...data,
        show_about: !!data.show_about,
        show_projects: !!data.show_projects,
        show_skills: !!data.show_skills,
        show_contact: !!data.show_contact
      }
    });
  } catch (error) {
    console.error('Error fetching navbar settings:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching navbar settings' });
  }
};

// @desc    Update Navbar Settings
// @route   PUT /api/navbar
// @access  Private (Admin)
export const updateNavbarSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      logo_name,
      about_label,
      projects_label,
      skills_label,
      contact_label,
      show_about,
      show_projects,
      show_skills,
      show_contact
    } = req.body;

    const safeLogoName = logo_name?.trim() || 'Sabari Portfolio';
    const safeAboutLabel = about_label?.trim() || 'About';
    const safeProjectsLabel = projects_label?.trim() || 'Projects';
    const safeSkillsLabel = skills_label?.trim() || 'Skills';
    const safeContactLabel = contact_label?.trim() || 'Contact';

    const safeShowAbout = show_about === undefined ? true : !!show_about;
    const safeShowProjects = show_projects === undefined ? true : !!show_projects;
    const safeShowSkills = show_skills === undefined ? true : !!show_skills;
    const safeShowContact = show_contact === undefined ? true : !!show_contact;

    const [existing] = await pool.query('SELECT id FROM navbar_settings LIMIT 1');
    const rows = existing as any[];

    if (rows.length === 0) {
      // Insert
      const query = `
        INSERT INTO navbar_settings 
          (logo_name, about_label, projects_label, skills_label, contact_label, show_about, show_projects, show_skills, show_contact)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await pool.query(query, [
        safeLogoName, safeAboutLabel, safeProjectsLabel, safeSkillsLabel, safeContactLabel,
        safeShowAbout, safeShowProjects, safeShowSkills, safeShowContact
      ]);
    } else {
      // Update
      const query = `
        UPDATE navbar_settings
        SET logo_name = ?, about_label = ?, projects_label = ?, skills_label = ?, contact_label = ?,
            show_about = ?, show_projects = ?, show_skills = ?, show_contact = ?
        WHERE id = ?
      `;
      await pool.query(query, [
        safeLogoName, safeAboutLabel, safeProjectsLabel, safeSkillsLabel, safeContactLabel,
        safeShowAbout, safeShowProjects, safeShowSkills, safeShowContact,
        rows[0].id
      ]);
    }

    res.status(200).json({ success: true, message: 'Navbar settings updated successfully' });
  } catch (error) {
    console.error('Error updating navbar settings:', error);
    res.status(500).json({ success: false, message: 'Server Error updating navbar settings' });
  }
};
