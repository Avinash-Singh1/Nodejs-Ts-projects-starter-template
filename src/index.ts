import express from 'express';
import cors from 'cors';                        // <-- add this
import connectDB from './config/db';
import { config } from './config/environment';
import indexRoutes from './routes/index';
import useRoutes from './routes/users';
import registerRoute from './routes/registration';

const app = express();

// Use the port from config
const port = config.port;

// connect to DB
connectDB();

// Middleware to parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Enable CORS
app.use(cors({
  origin: 'http://localhost:4200',   // frontend origin
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Define routes
app.use('/', indexRoutes);
app.use('/users', useRoutes);
app.use('/api/v1', registerRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
