import express from 'express';
import {
  loginUserHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerUserHandler,
} from '../controllers/auth.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validateAndTransform } from '../middleware/validateAndTransform';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';

const router = express.Router();

// Register user
router.post('/register', validateAndTransform(createUserSchema), registerUserHandler);

// Login user
router.post('/login', validateAndTransform(loginUserSchema), loginUserHandler);

// Logout user
router.get('/logout', deserializeUser, requireUser, logoutHandler);

// Refresh access token
router.get('/refresh', refreshAccessTokenHandler);

export default router;
