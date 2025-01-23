import express from 'express';
import { Units } from '../../controllers/index.mjs';  // Import the Units namespace
import { authMiddleware } from '../../middleware/index.mjs';

const router = express.Router();

// Apply auth and permissions middleware to all unit routes
router.use(authMiddleware);

// Unit Conversion Routes
router.post('/conversions', Units.addConversionController);
router.get('/conversions/:conversionId', Units.getConversionByIdController);
router.get('/conversions/from/:fromUnitId/to/:toUnitId', Units.getConversionByUnitsController);
router.put('/conversions/:conversionId', Units.updateConversionController);
router.delete('/conversions/:conversionId', Units.deleteConversionController);

// Units Routes
router.post('/', Units.addUnitController);
router.get('/:unitId', Units.getUnitByIdController);
router.get('/', Units.getAllUnitsController);
router.put('/:unitId', Units.updateUnitController);
router.delete('/:unitId', Units.deleteUnitController);

export default router;
