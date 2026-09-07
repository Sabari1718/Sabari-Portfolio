"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCertification = exports.updateCertification = exports.createCertification = exports.getCertifications = void 0;
const database_1 = __importDefault(require("../config/database"));
const getCertifications = async (req, res) => {
    try {
        const [certifications] = await database_1.default.query('SELECT * FROM certifications ORDER BY issue_date DESC');
        res.status(200).json({ success: true, data: certifications });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error fetching certifications' });
    }
};
exports.getCertifications = getCertifications;
const createCertification = async (req, res) => {
    try {
        const { title, issuer, issue_date, credential_url } = req.body;
        const query = `INSERT INTO certifications (title, issuer, issue_date, credential_url) VALUES (?, ?, ?, ?)`;
        const [result] = await database_1.default.query(query, [title, issuer, issue_date, credential_url]);
        const insertId = result.insertId;
        res.status(201).json({ success: true, message: 'Certification created successfully', data: { id: insertId } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error creating certification' });
    }
};
exports.createCertification = createCertification;
const updateCertification = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, issuer, issue_date, credential_url } = req.body;
        const query = `UPDATE certifications SET title = ?, issuer = ?, issue_date = ?, credential_url = ? WHERE id = ?`;
        const [result] = await database_1.default.query(query, [title, issuer, issue_date, credential_url, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Certification not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Certification updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error updating certification' });
    }
};
exports.updateCertification = updateCertification;
const deleteCertification = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await database_1.default.query('DELETE FROM certifications WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Certification not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Certification deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error deleting certification' });
    }
};
exports.deleteCertification = deleteCertification;
//# sourceMappingURL=certification.controller.js.map