import express from 'express';
import { mediaUploadMiddleware, authMiddleware } from '../../middleware/index.mjs'; 
import { Audio } from '../../controllers/index.mjs';


const router = express.Router();

// Apply authentication middleware globally to all routes, if needed
router.use(authMiddleware);

router.post('/synthesize-speech', Audio.generateSpeech);
router.post('/transcribe', mediaUploadMiddleware, Audio.transcribe);


export default router;




