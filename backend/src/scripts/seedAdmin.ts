import pool from '../config/database';
import { hashPassword } from '../utils/password';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@sabari.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    // Hash the password
    const passwordHash = await hashPassword(adminPassword);

    // Check if an admin already exists
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [adminEmail]);
    const users = rows as any[];

    if (users.length > 0) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      console.log('Updating password for existing admin...');
      await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [passwordHash, adminEmail]);
      console.log('Admin password updated successfully.');
    } else {
      console.log(`Creating new admin user with email ${adminEmail}...`);
      await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [
        adminName,
        adminEmail,
        passwordHash,
        'admin'
      ]);
      console.log('Admin user created successfully.');
    }

  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    process.exit(0);
  }
};

seedAdmin();
