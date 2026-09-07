"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSkill = exports.updateSkill = exports.createSkill = exports.getSkills = void 0;
const database_1 = __importDefault(require("../config/database"));
// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
    try {
        const [skills] = await database_1.default.query('SELECT * FROM skills ORDER BY display_order ASC, category ASC, name ASC');
        res.status(200).json({ success: true, data: skills });
    }
    catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ success: false, message: 'Server Error fetching skills' });
    }
};
exports.getSkills = getSkills;
// @desc    Create a skill
// @route   POST /api/skills
// @access  Private (Admin)
const createSkill = async (req, res) => {
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
        const [result] = await database_1.default.query(query, [
            name.trim(),
            category?.trim() ?? null,
            safeProficiency,
            icon?.trim() ?? null,
            display_order ?? 0
        ]);
        const insertId = result.insertId;
        res.status(201).json({ success: true, message: 'Skill created successfully', data: { id: insertId } });
    }
    catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({ success: false, message: 'Server Error creating skill' });
    }
};
exports.createSkill = createSkill;
// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private (Admin)
const updateSkill = async (req, res) => {
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
        const [result] = await database_1.default.query(query, [
            name.trim(),
            category?.trim() ?? null,
            safeProficiency,
            icon?.trim() ?? null,
            display_order ?? 0,
            id
        ]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Skill not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Skill updated successfully' });
    }
    catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({ success: false, message: 'Server Error updating skill' });
    }
};
exports.updateSkill = updateSkill;
// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private (Admin)
const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ success: false, message: 'Invalid skill ID' });
            return;
        }
        const [result] = await database_1.default.query('DELETE FROM skills WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Skill not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Skill deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ success: false, message: 'Server Error deleting skill' });
    }
};
exports.deleteSkill = deleteSkill;
//# sourceMappingURL=skill.controller.js.map