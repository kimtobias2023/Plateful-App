import express from 'express';

// Importing route definitions from sub-folders
import authRoutes from './auth/index.mjs';
import basicProfileRoutes from './basic-profile/index.mjs';
import extendedProfileRoutes from './extended-profile/index.mjs';

const router = express.Router();

// Mount the route definitions to their respective endpoints
router.use('/auth', authRoutes);
router.use('/profile', basicProfileRoutes);
router.use('/profile/extended', extendedProfileRoutes);

export default router;

