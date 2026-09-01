import pool from '../config/database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function updateAdmin() {
  try {
    const email = 'sabari1718@gmail.com';
    const password = 'rcb@1718';
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Update the admin user
    const [result]: any = await pool.query(
      'UPDATE users SET email = ?, password_hash = ? WHERE role = ?',
      [email, passwordHash, 'admin']
    );
    
    if (result.affectedRows === 0) {
      // If no admin user exists, insert one
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Admin', email, passwordHash, 'admin']
      );
      console.log('Inserted new admin user.');
    } else {
      console.log('Admin user updated successfully.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating admin user:', error);
    process.exit(1);
  }
}

updateAdmin();
