import express from 'express';
import {
  forgotPasswordController,
  loginController,
  registerController,
  resetPasswordController,
  refreshAccessTokenController,
  verifyLoginLinkController,
  validateSessionController,
  logoutController,
  googleAuthController,
} from '../../../controllers/users/auth/index.mjs';
import { sessionMiddleware } from '../../../middleware/index.mjs'; // Only import sessionMiddleware

const router = express.Router();

// Public routes (no session validation required)
router.post('/forgot-password', forgotPasswordController);
router.post('/login', loginController);
router.post('/register', registerController);
router.post('/google-signin', (req, res, next) => {
  console.log('[Router] Received POST /google-signin request:', req.body);
  next();
}, googleAuthController);
router.post('/reset-password', resetPasswordController);
router.get('/verify-login/:token', verifyLoginLinkController);

// Protected routes (require session validation)
router.use(sessionMiddleware); // Apply sessionMiddleware to all routes below this line

router.post('/refresh-token', refreshAccessTokenController); // Example of a route requiring session validation
router.post('/logout', logoutController);
router.get('/session-validate', validateSessionController);

export default router;





