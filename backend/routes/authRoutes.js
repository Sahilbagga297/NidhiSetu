import express from 'express';
import { register , login, logout , viewusers, getUserProfile, addEnrolledScheme, getEnrolledSchemes } from '../controllers/authController.js';
import auth from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const authLimiter = rateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 mins

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/viewusers' , viewusers);
router.get('/profile', auth, getUserProfile);
router.post('/schemes', auth, addEnrolledScheme);
router.get('/schemes', auth, getEnrolledSchemes);

export default router;