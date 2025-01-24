import express from 'express';
import { Auth } from './../controllers/index.mjs';
import { sessionMiddleware } from '../middleware/index.mjs'; // Only import sessionMiddleware

const router = express.Router();

router.post('/forgot-password', Auth.forgotPasswordController);
router.post('/login', Auth.loginController);
router.post('/register', Auth.registerController);
router.post('/google-signin', (req, res, next) => {
  console.log('[Router] Received POST /google-signin request:', req.body);
  next();
}, Auth.googleAuthController);
router.post('/reset-password', Auth.resetPasswordController);
router.get('/verify-login/:token', Auth.verifyLoginLinkController);

// Protected routes (require session validation)
router.use(sessionMiddleware); // Apply sessionMiddleware to all routes below this line

router.post('/refresh-token', Auth.refreshAccessTokenController); // Example of a route requiring session validation
router.post('/logout', Auth.logoutController);
router.get('/session-validate', Auth.validateSessionController);

export default router;





