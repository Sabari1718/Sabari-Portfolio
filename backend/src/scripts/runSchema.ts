import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function runSchema() {
  const connection = await mysql.createConnection({
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
    const schemaPath = path.join(process.cwd(), '../database/schema_test.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Applying schema...');
    await connection.query(schemaSql);
    console.log('Schema applied successfully!');
  } catch (error) {
    console.error('Error applying schema:', error);
  } finally {
    await connection.end();
  }
}

runSchema();
