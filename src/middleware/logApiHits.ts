import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const logApiHits = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  const uploadDir = './uploads';
  const logFilePath = path.join(uploadDir, 'log.txt');

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Check if log.txt exists or create and append log entry
  fs.appendFile(logFilePath, `\n${new Date().toISOString()}: ${req.ip} ${req.method}: ${req.path}`, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
    // Pass the request to the next middleware or route handler
    next();
  });
};

export default logApiHits;
