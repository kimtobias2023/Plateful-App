import express from 'express';
import { Social } from './../controllers/index.mjs';
import { authMiddleware, permissionsMiddleware } from './../middleware/index.mjs'; 

const router = express.Router();

// Apply auth and permissions middleware to all community routes
router.use(authMiddleware, permissionsMiddleware);  // Removed '/community' since it's redundant in this context

// Social Comments Routes
router.post('/comments', Social.createSocialComment);
router.get('/comments/:commentId', Social.getSocialCommentById);
router.put('/comments/:commentId', Social.updateSocialComment);
router.delete('/comments/:commentId', Social.deleteSocialComment);

// Social Posts Routes
router.post('/posts', Social.createSocialPost);
router.get('/posts/:postId', Social.getSocialPostById);
router.put('/posts/:postId', Social.updateSocialPost);
router.delete('/posts/:postId', Social.deleteSocialPost);
router.get('/posts', Social.getAllSocialPosts);

export default router;



