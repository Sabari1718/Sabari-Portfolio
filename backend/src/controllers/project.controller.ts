import { Request, Response } from 'express';
import pool from '../config/database';

// @desc    Get all projects (public — returns only visible ones; admin can see all with ?all=true)
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const showAll = req.query.all === 'true';
    const query = showAll
      ? 'SELECT * FROM projects ORDER BY display_order ASC, created_at DESC'
      : 'SELECT * FROM projects WHERE is_visible = TRUE ORDER BY display_order ASC, created_at DESC';

    const [projects] = await pool.query(query);
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching projects' });
  }
};

// @desc    Get single project by ID or slug
// @route   GET /api/projects/:id
// @access  Public
export const getProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    // Try slug first, then numeric ID
    const query = isNaN(Number(slug))
      ? 'SELECT * FROM projects WHERE slug = ? LIMIT 1'
      : 'SELECT * FROM projects WHERE id = ? LIMIT 1';
    const [rows] = await pool.query(query, [slug]);
    const projects = rows as any[];
    
    if (projects.length === 0) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    
    res.status(200).json({ success: true, data: projects[0] });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching project' });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title, category, slug, short_description, description,
      image_url, github_url, live_url, featured, status,
      type, display_order, is_visible
    } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Project title is required' });
      return;
    }
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Project slug is required' });
      return;
    }

    const safeSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const query = `
      INSERT INTO projects 
        (title, category, slug, short_description, description, image_url, github_url, live_url, featured, status, type, display_order, is_visible)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      title.trim(),
      category?.trim() ?? null,
      safeSlug,
      short_description?.trim() ?? null,
      description?.trim() ?? null,
      image_url?.trim() ?? null,
      github_url?.trim() ?? null,
      live_url?.trim() ?? null,
      featured === true || featured === 'true' ? 1 : 0,
      status?.trim() ?? 'completed',
      type?.trim() ?? 'web',
      display_order ?? 0,
      is_visible === false || is_visible === 'false' ? 0 : 1
    ]);
    
    const insertId = (result as any).insertId;
    res.status(201).json({ success: true, message: 'Project created successfully', data: { id: insertId } });
  } catch (error: any) {
    console.error('Error creating project:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ success: false, message: 'A project with this slug already exists' });
      return;
    }
    res.status(500).json({ success: false, message: 'Server Error creating project' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title, category, slug, short_description, description,
      image_url, github_url, live_url, featured, status,
      type, display_order, is_visible
    } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Project title is required' });
      return;
    }

    const safeSlug = slug ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') : null;

    const query = `
      UPDATE projects 
      SET title = ?, category = ?, slug = ?, short_description = ?, description = ?,
          image_url = ?, github_url = ?, live_url = ?, featured = ?, status = ?,
          type = ?, display_order = ?, is_visible = ?
      WHERE id = ?
    `;
    
    const [result] = await pool.query(query, [
      title.trim(),
      category?.trim() ?? null,
      safeSlug,
      short_description?.trim() ?? null,
      description?.trim() ?? null,
      image_url?.trim() ?? null,
      github_url?.trim() ?? null,
      live_url?.trim() ?? null,
      featured === true || featured === 'true' ? 1 : 0,
      status?.trim() ?? 'completed',
      type?.trim() ?? 'web',
      display_order ?? 0,
      is_visible === false || is_visible === 'false' ? 0 : 1,
      id
    ]);
    
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    
    res.status(200).json({ success: true, message: 'Project updated successfully' });
  } catch (error: any) {
    console.error('Error updating project:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ success: false, message: 'A project with this slug already exists' });
      return;
    }
    res.status(500).json({ success: false, message: 'Server Error updating project' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ success: false, message: 'Invalid project ID' });
      return;
    }

    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Server Error deleting project' });
  }
};
