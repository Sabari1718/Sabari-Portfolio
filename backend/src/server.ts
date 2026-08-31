import app from './app';
import { testConnection } from './config/database';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the health endpoint at: http://localhost:${PORT}/api/health`);
  
  // Test MySQL connection when server starts
  await testConnection();
});
