"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../utils/password");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const seedAdmin = async () => {
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@sabari.com').trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const adminName = process.env.ADMIN_NAME || 'Admin';
        // Hash the password
        const passwordHash = await (0, password_1.hashPassword)(adminPassword);
        // Check if an admin already exists
        const [rows] = await database_1.default.query('SELECT * FROM users WHERE email = ? LIMIT 1', [adminEmail]);
        const users = rows;
        if (users.length > 0) {
            console.log(`Admin user with email ${adminEmail} already exists.`);
            console.log('Updating password for existing admin...');
            await database_1.default.query('UPDATE users SET password_hash = ? WHERE email = ?', [passwordHash, adminEmail]);
            console.log('Admin password updated successfully.');
        }
        else {
            console.log(`Creating new admin user with email ${adminEmail}...`);
            await database_1.default.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [
                adminName,
                adminEmail,
                passwordHash,
                'admin'
            ]);
            console.log('Admin user created successfully.');
        }
    }
    catch (error) {
        console.error('Error seeding admin user:', error);
    }
    finally {
        process.exit(0);
    }
};
seedAdmin();
//# sourceMappingURL=seedAdmin.js.map