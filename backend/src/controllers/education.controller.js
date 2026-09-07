"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEducation = exports.updateEducation = exports.createEducation = exports.getEducation = void 0;
const database_1 = __importDefault(require("../config/database"));
// @desc    Get all education records
// @route   GET /api/education
// @access  Public
const getEducation = async (req, res) => {
    try {
        const [education] = await database_1.default.query('SELECT * FROM education ORDER BY display_order ASC, start_date DESC');
        res.status(200).json({ success: true, data: education });
    }
    catch (error) {
        console.error('Error fetching education:', error);
        res.status(500).json({ success: false, message: 'Server Error fetching education' });
    }
};
exports.getEducation = getEducation;
// @desc    Create an education record
// @route   POST /api/education
// @access  Private (Admin)
const createEducation = async (req, res) => {
    try {
        const { institution, degree, field, grade, start_date, end_date, description, display_order } = req.body;
        if (!institution || typeof institution !== 'string' || institution.trim().length === 0) {
            res.status(400).json({ success: false, message: 'Institution name is required' });
            return;
        }
        const query = `
      INSERT INTO education (institution, degree, field, grade, start_date, end_date, description, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = await database_1.default.query(query, [
            institution.trim(),
            degree?.trim() ?? null,
            field?.trim() ?? null,
            grade?.trim() ?? null,
            start_date || null,
            end_date || null,
            description?.trim() ?? null,
            display_order ?? 0
        ]);
        const insertId = result.insertId;
        res.status(201).json({ success: true, message: 'Education created successfully', data: { id: insertId } });
    }
    catch (error) {
        console.error('Error creating education:', error);
        res.status(500).json({ success: false, message: 'Server Error creating education' });
    }
};
exports.createEducation = createEducation;
// @desc    Update an education record
// @route   PUT /api/education/:id
// @access  Private (Admin)
const updateEducation = async (req, res) => {
    try {
        const { id } = req.params;
        const { institution, degree, field, grade, start_date, end_date, description, display_order } = req.body;
        if (!institution || typeof institution !== 'string' || institution.trim().length === 0) {
            res.status(400).json({ success: false, message: 'Institution name is required' });
            return;
        }
        const query = `
      UPDATE education 
      SET institution = ?, degree = ?, field = ?, grade = ?, start_date = ?, end_date = ?, description = ?, display_order = ?
      WHERE id = ?
    `;
        const [result] = await database_1.default.query(query, [
            institution.trim(),
            degree?.trim() ?? null,
            field?.trim() ?? null,
            grade?.trim() ?? null,
            start_date || null,
            end_date || null,
            description?.trim() ?? null,
            display_order ?? 0,
            id
        ]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Education record not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Education updated successfully' });
    }
    catch (error) {
        console.error('Error updating education:', error);
        res.status(500).json({ success: false, message: 'Server Error updating education' });
    }
};
exports.updateEducation = updateEducation;
// @desc    Delete an education record
// @route   DELETE /api/education/:id
// @access  Private (Admin)
const deleteEducation = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ success: false, message: 'Invalid education ID' });
            return;
        }
        const [result] = await database_1.default.query('DELETE FROM education WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Education record not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Education deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting education:', error);
        res.status(500).json({ success: false, message: 'Server Error deleting education' });
    }
};
exports.deleteEducation = deleteEducation;
//# sourceMappingURL=education.controller.js.map