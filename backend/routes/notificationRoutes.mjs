import express from 'express';
import { Notifications } from './../controllers/index.mjs';  // Import the Notifications namespace
import { authMiddleware, permissionsMiddleware } from './../middleware/index.mjs';

const router = express.Router();

// Apply auth and permissions middleware to all notifications routes
router.use(authMiddleware, permissionsMiddleware);

// Notifications Routes
router.post('/', Notifications.create);
router.get('/:id', Notifications.get);
router.put('/:id', Notifications.update);
router.delete('/:id', Notifications.deleteNotification);
router.get('/user/:userId', Notifications.listForUser);
router.put('/:id/read', Notifications.markAsRead);

export default router;


