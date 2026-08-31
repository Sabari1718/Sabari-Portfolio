require('dotenv').config();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

async function testUpload() {
  const testImagePath = path.join(__dirname, 'test-image.png');
  fs.writeFileSync(testImagePath, 'fake-image-content');

  const secret = process.env.JWT_SECRET || 'sabari_secret_key_123!@#';
  const token = jwt.sign({ id: '1', role: 'admin' }, secret, { expiresIn: '1h' });

  const blob = new Blob([fs.readFileSync(testImagePath)]);
  const form = new FormData();
  form.append('image', blob, 'test-image.png');

  try {
    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: form
    });
    
    const text = await res.text();
    console.log('Upload Result Status:', res.status);
    console.log('Upload Result Body:', text);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    fs.unlinkSync(testImagePath);
  }
}
testUpload();
