import express from 'express';
import { Labels } from '../../controllers/index.mjs';  // Import the Labels namespace
import { authMiddleware, recipeAuthMiddleware } from '../../middleware/index.mjs';

const router = express.Router();

// Apply auth and permissions middleware to all label routes
router.use(authMiddleware);

// Labels Routes
router.post('/', Labels.createLabelController);
router.get('/:labelId', Labels.getLabelController);
router.get('/', Labels.getAllLabelsController);
router.put('/:labelId/updateLabel', recipeAuthMiddleware, Labels.updateLabelController);
router.delete('/:labelId', Labels.deleteLabelController);

export default router;


