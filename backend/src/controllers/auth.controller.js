"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAdmin = exports.getMe = exports.login = void 0;
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email: rawEmail, password } = req.body;
        if (!rawEmail || !password) {
            console.log('Login failed: Missing email or password');
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        // Trim and lower case the email to prevent whitespace issues
        const email = rawEmail.trim().toLowerCase();
        console.log(`Attempting login for email: '${email}'`);
        // Find user by email
        const [rows] = await database_1.default.query('SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1', [email]);
        const users = rows;
        if (users.length === 0) {
            console.log(`Login failed: User with email '${email}' not found in database.`);
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const user = users[0];
        // Check if password matches
        const isMatch = await (0, password_1.comparePassword)(password, user.password_hash);
        if (!isMatch) {
            console.log(`Login failed: Password mismatch for user '${email}'.`);
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        console.log(`Login successful for user '${email}'.`);
        // Generate JWT token
        const token = (0, jwt_1.generateToken)(user.id.toString(), user.role);
        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error during login' });
    }
};
exports.login = login;
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        const [rows] = await database_1.default.query('SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1', [userId]);
        const users = rows;
        if (users.length === 0) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, data: users[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error fetching user info' });
    }
};
exports.getMe = getMe;
// @desc    Register first admin (One time use only)
// @route   POST /api/auth/setup
// @access  Public
const setupAdmin = async (req, res) => {
    try {
        // Check if any user already exists
        const [rows] = await database_1.default.query('SELECT COUNT(*) as count FROM users');
        const count = rows[0].count;
        if (count > 0) {
            res.status(400).json({ success: false, message: 'Admin already exists. Setup can only be run once.' });
            return;
        }
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
            return;
        }
        // Hash password
        const passwordHash = await (0, password_1.hashPassword)(password);
        // Insert admin user
        const query = 'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)';
        await database_1.default.query(query, [name, email, passwordHash, 'admin']);
        res.status(201).json({ success: true, message: 'Admin created successfully! You can now login.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error during setup' });
    }
};
exports.setupAdmin = setupAdmin;
//# sourceMappingURL=auth.controller.js.map