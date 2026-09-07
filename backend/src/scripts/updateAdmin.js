"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function updateAdmin() {
    try {
        const email = 'sabari1718@gmail.com';
        const password = 'rcb@1718';
        // Hash the new password
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        // Update the admin user
        const [result] = await database_1.default.query('UPDATE users SET email = ?, password_hash = ? WHERE role = ?', [email, passwordHash, 'admin']);
        if (result.affectedRows === 0) {
            // If no admin user exists, insert one
            await database_1.default.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', ['Admin', email, passwordHash, 'admin']);
            console.log('Inserted new admin user.');
        }
        else {
            console.log('Admin user updated successfully.');
        }
        process.exit(0);
    }
    catch (error) {
        console.error('Error updating admin user:', error);
        process.exit(1);
    }
}
updateAdmin();
//# sourceMappingURL=updateAdmin.js.map