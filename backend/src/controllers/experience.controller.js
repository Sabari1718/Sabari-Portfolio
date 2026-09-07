"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExperience = exports.updateExperience = exports.createExperience = exports.getExperiences = void 0;
const database_1 = __importDefault(require("../config/database"));
// @desc    Get all experiences
// @route   GET /api/experience
// @access  Public
const getExperiences = async (req, res) => {
    try {
        const [experiences] = await database_1.default.query('SELECT * FROM experiences ORDER BY display_order ASC, start_date DESC');
        res.status(200).json({ success: true, data: experiences });
    }
    catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ success: false, message: 'Server Error fetching experiences' });
    }
};
exports.getExperiences = getExperiences;
// @desc    Create an experience
// @route   POST /api/experience
// @access  Private (Admin)
const createExperience = async (req, res) => {
    try {
        const { company, logo_url, role, description, technologies, start_date, end_date, currently_working, location, display_order } = req.body;
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
        const [result] = await database_1.default.query(query, [
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
        const insertId = result.insertId;
        res.status(201).json({ success: true, message: 'Experience created successfully', data: { id: insertId } });
    }
    catch (error) {
        console.error('Error creating experience:', error);
        res.status(500).json({ success: false, message: 'Server Error creating experience' });
    }
};
exports.createExperience = createExperience;
// @desc    Update an experience
// @route   PUT /api/experience/:id
// @access  Private (Admin)
const updateExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { company, logo_url, role, description, technologies, start_date, end_date, currently_working, location, display_order } = req.body;
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
        const [result] = await database_1.default.query(query, [
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
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Experience not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Experience updated successfully' });
    }
    catch (error) {
        console.error('Error updating experience:', error);
        res.status(500).json({ success: false, message: 'Server Error updating experience' });
    }
};
exports.updateExperience = updateExperience;
// @desc    Delete an experience
// @route   DELETE /api/experience/:id
// @access  Private (Admin)
const deleteExperience = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ success: false, message: 'Invalid experience ID' });
            return;
        }
        const [result] = await database_1.default.query('DELETE FROM experiences WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Experience not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Experience deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting experience:', error);
        res.status(500).json({ success: false, message: 'Server Error deleting experience' });
    }
};
exports.deleteExperience = deleteExperience;
//# sourceMappingURL=experience.controller.js.map