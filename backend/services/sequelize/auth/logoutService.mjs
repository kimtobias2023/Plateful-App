import RefreshToken from './../../models/sequelize/auth/RefreshToken.mjs';
import { CustomError } from '../../../utils/errors/index.mjs';
import { logger } from '../../../utils/logger.mjs';

async function logoutService(req) {
    // Extract refreshToken from the HttpOnly cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new CustomError(400, "Refresh token not provided.");
    }

    const existingToken = await RefreshToken.findOne({ where: { token: refreshToken } });

    if (!existingToken) {
        logger.info(`Attempted logout with non-existent or expired token: ${refreshToken}`);
        return { message: 'Logged out successfully.' };  // Provide a generic message.
    }

    try {
        await RefreshToken.destroy({ where: { token: refreshToken } });

        // If you have a logging mechanism in place, consider logging the logout action.
        logger.info(`User with ID: ${existingToken.userId} logged out successfully.`); // Updated to camelCase

        return { message: 'Logged out successfully.' };
    } catch (error) {
        // If you have a logging mechanism, log the error.
        logger.error(`Failed to logout user with ID: ${existingToken.userId}. Error: ${error.message}`); // Updated to camelCase

        throw new CustomError(500, "Failed to logout due to a server error.");
    }
}

export { logoutService };

