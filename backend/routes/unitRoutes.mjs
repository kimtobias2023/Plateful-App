import express from 'express';
import { Unit } from './../controllers/index.mjs';  // Import the Unit namespace
import { authMiddleware } from './../middleware/index.mjs';

const router = express.Router();

// Apply auth and permissions middleware to all unit routes
router.use(authMiddleware);

// Unit Conversion Routes
router.post('/conversions', Unit.addConversionController);
router.get('/conversions/:conversionId', Unit.getConversionByIdController);
router.get('/conversions/from/:fromUnitId/to/:toUnitId', Unit.getConversionByUnitController);
router.put('/conversions/:conversionId', Unit.updateConversionController);
router.delete('/conversions/:conversionId', Unit.deleteConversionController);

// Unit Routes
router.post('/', Unit.addUnitController);
router.get('/:unitId', Unit.getUnitByIdController);
router.get('/', Unit.getAllUnitController);
router.put('/:unitId', Unit.updateUnitController);
router.delete('/:unitId', Unit.deleteUnitController);

export default router;
