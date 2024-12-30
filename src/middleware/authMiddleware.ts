import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

const protect = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string };

    // Attach decoded user info to the request object
    req.user = decoded; // `req.user` should be recognized now
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default protect;
