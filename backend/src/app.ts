import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import projectRoutes from './routes/project.routes';
import skillRoutes from './routes/skill.routes';
import experienceRoutes from './routes/experience.routes';
import educationRoutes from './routes/education.routes';
import certificationRoutes from './routes/certification.routes';
import socialRoutes from './routes/social.routes';
import contactRoutes from './routes/contact.routes';
import uploadRoutes from './routes/upload.routes';
import navbarRoutes from './routes/navbar.routes';

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing (allows frontend to talk to backend)
app.use(express.json()); // Parses incoming JSON requests

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/social-links', socialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/navbar', navbarRoutes);

// Health check endpoint (Phase 1)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Sabari Portfolio API is running'
  });
});

export default app;
