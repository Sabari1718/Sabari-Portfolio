"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
async function createNavbarTable() {
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
        const schemaSql = `
      CREATE TABLE IF NOT EXISTS navbar_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          logo_name VARCHAR(255) DEFAULT 'Sabari Portfolio',
          about_label VARCHAR(100) DEFAULT 'About',
          projects_label VARCHAR(100) DEFAULT 'Projects',
          skills_label VARCHAR(100) DEFAULT 'Skills',
          contact_label VARCHAR(100) DEFAULT 'Contact',
          show_about BOOLEAN DEFAULT TRUE,
          show_projects BOOLEAN DEFAULT TRUE,
          show_skills BOOLEAN DEFAULT TRUE,
          show_contact BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      INSERT INTO navbar_settings (logo_name, about_label, projects_label, skills_label, contact_label, show_about, show_projects, show_skills, show_contact)
      SELECT 'Sabari Portfolio', 'About', 'Projects', 'Skills', 'Contact', TRUE, TRUE, TRUE, TRUE
      WHERE NOT EXISTS (SELECT 1 FROM navbar_settings);
    `;
        console.log('Creating table and inserting defaults...');
        await connection.query(schemaSql);
        console.log('Success!');
    }
    catch (error) {
        console.error('Error applying schema:', error);
    }
    finally {
        await connection.end();
    }
}
createNavbarTable();
//# sourceMappingURL=createNavbarTable.js.map