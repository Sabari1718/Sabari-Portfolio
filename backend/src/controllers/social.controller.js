"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSocialLink = exports.updateSocialLink = exports.createSocialLink = exports.getSocialLinks = void 0;
const database_1 = __importDefault(require("../config/database"));
const getSocialLinks = async (req, res) => {
    try {
        const [socialLinks] = await database_1.default.query('SELECT * FROM social_links');
        res.status(200).json({ success: true, data: socialLinks });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error fetching social links' });
    }
};
exports.getSocialLinks = getSocialLinks;
const createSocialLink = async (req, res) => {
    try {
        const { platform, url, icon } = req.body;
        const query = `INSERT INTO social_links (platform, url, icon) VALUES (?, ?, ?)`;
        const [result] = await database_1.default.query(query, [platform, url, icon]);
        const insertId = result.insertId;
        res.status(201).json({ success: true, message: 'Social link created successfully', data: { id: insertId } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error creating social link' });
    }
};
exports.createSocialLink = createSocialLink;
const updateSocialLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform, url, icon } = req.body;
        const query = `UPDATE social_links SET platform = ?, url = ?, icon = ? WHERE id = ?`;
        const [result] = await database_1.default.query(query, [platform, url, icon, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Social link not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Social link updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error updating social link' });
    }
};
exports.updateSocialLink = updateSocialLink;
const deleteSocialLink = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await database_1.default.query('DELETE FROM social_links WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Social link not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Social link deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error deleting social link' });
    }
};
exports.deleteSocialLink = deleteSocialLink;
//# sourceMappingURL=social.controller.js.map