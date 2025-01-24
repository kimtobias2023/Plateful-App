import express from 'express';
import { Label } from '../controllers/index.mjs';  // Import the Label namespace
import { authMiddleware, recipeAuthMiddleware } from '../middleware/index.mjs';

const router = express.Router();

// Apply auth and permissions middleware to all label routes
router.use(authMiddleware);

// Label Routes
router.post('/', Label.createLabelController);
router.get('/:labelId', Label.getLabelController);
router.get('/', Label.getAllLabelController);
router.put('/:labelId/updateLabel', recipeAuthMiddleware, Label.updateLabelController);
router.delete('/:labelId', Label.deleteLabelController);

export default router;


