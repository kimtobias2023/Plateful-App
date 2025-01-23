import { getProfile } from '../../../services/users/basic-profile/userProfileService.mjs';
import { getAllMediaForUser } from '../../../services/users/extended-profile/userMediaService.mjs';
import { CustomError } from '../../../utils/errors/index.mjs';

async function getUserDetailsController(req, res) {
    try {
        const userId = req.user.id; // Assuming user ID is available from the request (e.g., from a JWT token)

        // Fetch basic profile information
        const basicProfile = await getProfile(userId);
        if (!basicProfile) {
            throw new CustomError(404, 'Basic profile not found.');
        }

        // Fetch user media
        const userMedia = await getAllMediaForUser(userId);
        if (!userMedia) {
            throw new CustomError(404, 'User media not found.');
        }

        // Combine basic profile and user media into one response
        res.status(200).json({
            success: true,
            data: {
                basicProfile: basicProfile,
                userMedia: userMedia
            }
        });

    } catch (error) {
        console.error('Error in getUserDetailsController:', error);
        const statusCode = error.httpStatus || 500;
        res.status(statusCode).json({ message: error.message || 'Failed to fetch user details.' });
    }
}

export { getUserDetailsController };

