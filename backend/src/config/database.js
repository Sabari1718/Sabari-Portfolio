"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create a connection pool to MySQL
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sabari_portfolio',
    port: parseInt(process.env.DB_PORT || '3306'),
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// Test connection function
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database successfully!');
        connection.release(); // release it back to the pool
    }
    catch (error) {
        console.error('❌ MySQL Connection Error:');
        console.error(error);
    }
};
exports.testConnection = testConnection;
exports.default = pool;
//# sourceMappingURL=database.js.map