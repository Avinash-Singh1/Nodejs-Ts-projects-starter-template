// src/server.ts
import express from 'express';
import connectDB from './config/db';
import { config } from './config/environment';
import indexRoutes from './routes/index';
import useRoutes from './routes/users';
import logApiHits from './middleware/logApiHits';

const app = express();
app.use(logApiHits);
// Use the port from config
const port = config.port;
connectDB();
// Middleware to parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define a basic route
app.use('/',indexRoutes);
app.use('/users',useRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
