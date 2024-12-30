import { Request, Response, NextFunction } from 'express';

const logApiHits = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass the request to the next middleware or route handler
};

export default logApiHits;
