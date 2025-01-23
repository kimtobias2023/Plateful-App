import { refreshAccessTokenService } from '../../../services/users/auth/refreshAccessTokenService.mjs';
import { CustomError } from '../../../utils/errors/CustomError.mjs';
import { logger } from '../../../utils/logger.mjs'; // Assuming you have a logger utility

const refreshAccessTokenController = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        logger.error('No refresh token provided.');
        return res.status(401).json({ message: 'No refresh token provided.' });
    }

    try {
        const { accessToken, refreshToken: newRefreshToken } = await refreshAccessTokenService(refreshToken);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            domain: 'localhost',
            path: '/',
        };

        res.cookie('token', accessToken, cookieOptions);
        res.cookie('refreshToken', newRefreshToken, cookieOptions);

        logger.info('Access token refreshed successfully.');

        res.json({ success: true, message: 'Access token refreshed successfully.' });

    } catch (error) {
        logger.error('Error in refreshAccessTokenController:', error);

        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        next(error);
    }
};

export { refreshAccessTokenController };


