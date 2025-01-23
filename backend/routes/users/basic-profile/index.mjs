import express from 'express';
import * as BasicProfileControllers from '../../../controllers/users/basic-profile/index.mjs';
import { authMiddleware, permissionsMiddleware } from '../../../middleware/index.mjs';


const {
    changePasswords,
    deleteUsers,
    getUserDetailsController,
    updateUserDetails
} = BasicProfileControllers;

const router = express.Router();

// Apply middleware to routes as needed

// Routes for changePasswordsController
router.put('/change-password', authMiddleware, permissionsMiddleware, changePasswords);

// Routes for deleteUsersController
router.delete('/delete-user/:userId', authMiddleware, permissionsMiddleware, deleteUsers);

// Routes for getUserDetailsController
router.get('/user-details/:userId', authMiddleware, getUserDetailsController);

// Routes for updateUserDetailsController
router.put('/update-user-details/:userId', authMiddleware, updateUserDetails);

export default router;



