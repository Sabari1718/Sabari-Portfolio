import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Extend Express Request to include user info
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Middleware to check if user is logged in
export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    return;
  }

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    return;
  }

  // Attach user to request object
  req.user = decoded;
  next();
};

// Middleware to check if user is an Admin
export const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};
