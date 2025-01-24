import express from 'express';
import { Media } from './../controllers/index.mjs';
import { authMiddleware, mediaUploadMiddleware } from './../middleware/index.mjs';

const router = express.Router();

router.use(authMiddleware);
// Routes for extended profile information remain unchanged
router.get('/profiles/:userId', Media.getProfilesController);
router.get('/user-media/:userId', Media.getUserMediaController);
router.delete('/remove-profile-media/:userId/:mediaLabel/:mediaId', Media.removeProfileMediaController);


router.use(authMiddleware, mediaUploadMiddleware);
// Apply mediaUploadMiddleware to routes that need file upload
router.post('/generate-presigned-url/:userId', Media.generatePresignedUrlController); // For photos
router.post('/confirm-photo-upload/:userId', Media.confirmPhotoUploadController);
router.post('/generate-presigned-video-url/:userId', Media.generatePresignedVideoUrlController);
router.post('/confirm-video-upload/:userId', Media.confirmVideoUploadController);


export default router;



