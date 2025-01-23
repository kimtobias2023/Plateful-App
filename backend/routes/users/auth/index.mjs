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
  googleAuthController
} from '../../../controllers/users/auth/index.mjs';

const router = express.Router();

router.post('/forgot-password', forgotPasswordController);
router.post('/login', loginController);
router.post('/register', registerController);
router.post('/google-signin', (req, res, next) => {
  console.log('[Router] Received POST /google-signin request:', req.body);
  next();
}, googleAuthController);
router.post('/reset-password', resetPasswordController);
router.get('/verify-login/:token', verifyLoginLinkController);
router.post('/refresh-token', refreshAccessTokenController);
router.post('/logout', logoutController);
router.get('/session-validate', validateSessionController);

export default router;





