import express from 'express';

// Import the Community namespace
import { Community } from '../../controllers/index.mjs';

// Import middlewares
import {
    authMiddleware,
    permissionsMiddleware
} from '../../middleware/index.mjs'; // Make sure the path is correct

const router = express.Router();

// Apply auth and permissions middleware to all community routes
router.use(authMiddleware, permissionsMiddleware);  // Removed '/community' since it's redundant in this context

// Community Comments Routes
router.post('/comments', Community.createCommunityComment);
router.get('/comments/:commentId', Community.getCommunityCommentById);
router.put('/comments/:commentId', Community.updateCommunityComment);
router.delete('/comments/:commentId', Community.deleteCommunityComment);

// Community Posts Routes
router.post('/posts', Community.createCommunityPost);
router.get('/posts/:postId', Community.getCommunityPostById);
router.put('/posts/:postId', Community.updateCommunityPost);
router.delete('/posts/:postId', Community.deleteCommunityPost);
router.get('/posts', Community.getAllCommunityPosts);

export default router;



