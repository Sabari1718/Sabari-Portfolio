require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkSchema() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sabari_portfolio'
  });

  try {
    const [rows] = await pool.query('DESCRIBE profile');
    console.log(rows);
    
    // Also try doing the exact INSERT to see the error
    try {
      const query = `
        INSERT INTO profile (name, headline, bio, profile_image, location, email, phone, resume_url, github_url, linkedin_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await pool.query(query, [null, null, null, 'http://test', null, null, null, null, null, null]);
      console.log('Insert succeeded, rolling back...');
      await pool.query('DELETE FROM profile');
    } catch (err) {
      console.log('INSERT ERROR:', err.message);
    }

  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}
checkSchema();
