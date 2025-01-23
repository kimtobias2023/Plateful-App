import express from 'express';
import * as ExtendedProfileControllers from '../../../controllers/users/extended-profile/index.mjs';
import { authMiddleware, mediaUploadMiddleware } from '../../../middleware/index.mjs';


const {
    getProfilesController,
    getUserMediaController,
    generatePresignedUrlController, // Assuming this is for photos
    confirmPhotoUploadController,
    generatePresignedVideoUrlController,
    confirmVideoUploadController,
    removeProfileMediaController,
} = ExtendedProfileControllers;

const router = express.Router();

// Apply mediaUploadMiddleware to routes that need file upload
router.post('/generate-presigned-url/:userId', authMiddleware, mediaUploadMiddleware, generatePresignedUrlController); // For photos
router.post('/confirm-photo-upload/:userId', authMiddleware, mediaUploadMiddleware, confirmPhotoUploadController);
router.post('/generate-presigned-video-url/:userId', authMiddleware, mediaUploadMiddleware, generatePresignedVideoUrlController);
router.post('/confirm-video-upload/:userId', authMiddleware, mediaUploadMiddleware, confirmVideoUploadController);

// Note: If these routes are specifically for handling file uploads, ensure your controllers are set up to handle the files provided by mediaUploadMiddleware.
// For routes not dealing with uploads, no change is needed
router.delete('/remove-profile-media/:userId/:mediaLabel/:mediaId', authMiddleware, removeProfileMediaController);

// Routes for extended profile information remain unchanged
router.get('/profiles/:userId', authMiddleware, getProfilesController);
router.get('/user-media/:userId', authMiddleware, getUserMediaController);

export default router;



