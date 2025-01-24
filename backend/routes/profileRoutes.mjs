import express from 'express';
import { Profile } from './../controllers/index.mjs';
import { authMiddleware, permissionsMiddleware } from './../middleware/index.mjs';

const router = express.Router();

router.use(authMiddleware);

router.get('/user-details/:userId', Profile.getUserDetailsController);
router.put('/update-user-details/:userId', Profile.updateUserDetails);

router.use(permissionsMiddleware, authMiddleware);

router.put('/change-password', Profile.changePasswords);
router.delete('/delete-user/:userId', Profile.deleteUsers);

export default router;



