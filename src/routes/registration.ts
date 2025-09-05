// src/routes/registration.ts
import { Router } from 'express';
import registrationController from '../controllers/registrationController';
import { validate } from '../middlewares/validate'; 
import * as schema from '../schemas/registrationSchema';
import authController from '../controllers/authController';
const router = Router();

router.post('/register', validate(schema.signUp), registrationController.createRegistration);
router.post('/login', validate(schema.login), authController.login);
router.post('/verify-otp', validate(schema.verifyOTP), registrationController.verifyOtp);

export default router;
