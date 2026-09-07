"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function runSchema() {
    const connection = await promise_1.default.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 4000,
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
        },
        multipleStatements: true
    });
    try {
        console.log('Connected to TiDB Production DB.');
        const schemaPath = path_1.default.join(process.cwd(), '../database/schema_test.sql');
        const schemaSql = fs_1.default.readFileSync(schemaPath, 'utf8');
        console.log('Applying schema...');
        await connection.query(schemaSql);
        console.log('Schema applied successfully!');
    }
    catch (error) {
        console.error('Error applying schema:', error);
    }
    finally {
        await connection.end();
    }
}
runSchema();
//# sourceMappingURL=runSchema.js.map