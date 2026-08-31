import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool to MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sabari_portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection function
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully!');
    connection.release(); // release it back to the pool
  } catch (error) {
    console.error('❌ MySQL Connection Error:');
    console.error(error);
  }
};

export default pool;
