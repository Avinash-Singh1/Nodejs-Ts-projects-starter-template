import { Router } from 'express';
import { getAllUser, getUserid, createUser, register, login } from '../controllers/userController';
import protect from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', register);  // Register a user
router.post('/login', login);        // Login a user

// Protected routes
router.get('/', protect, getAllUser);        // Get all users
router.get('/:id', protect, getUserid);  // Get user by ID
router.post('/', protect, createUser);     // Create a new user

export default router;
