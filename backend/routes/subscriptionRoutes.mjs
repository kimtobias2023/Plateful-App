import express from 'express';
import { Subscription } from './../controllers/index.mjs';
import { authMiddleware } from './../middleware/index.mjs'; // Middleware to ensure user is authenticated

const router = express.Router();

router.use(authMiddleware);

// Public routes (no session validation required)
router.get('/get-subscription', Subscription.getSubscription);
router.post('/subscribe', Subscription.createSubscriptionController);
router.delete('/cancel-subscription', Subscription.cancelSubscriptionController);

export default router;
