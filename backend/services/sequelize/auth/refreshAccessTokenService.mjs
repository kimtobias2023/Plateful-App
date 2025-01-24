import jwt from 'jsonwebtoken';
import User from '../../../models/sequelize/profile/User.mjs';
import RefreshToken from '../../../models/sequelize/auth/RefreshToken.mjs';
import dotenv from 'dotenv';
import { CustomError, AuthenticationError } from '../../../utils/errors/index.mjs';

dotenv.config();

async function refreshAccessTokenService(refreshToken) {
    // Verify the refresh token
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new CustomError(401, 'Invalid or expired refresh token.');
    }

    // Check if the refresh token exists in the database
    const storedRefreshToken = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!storedRefreshToken) {
        throw new CustomError(401, 'Invalid refresh token.');
    }

    // Ensure the user associated with the refresh token is still active
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) { // Assuming 'isActive' is a flag on the user model.
        throw new AuthenticationError('User is not active.');
    }

    // If valid and not expired, create a new access token
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Optionally: Invalidate the used refresh token and generate a new one.
    await storedRefreshToken.destroy();
    const newRefreshToken = jwt.sign({ userId: decoded.userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    await RefreshToken.create({ userId: decoded.userId, token: newRefreshToken });

    return {
        accessToken,
        refreshToken: newRefreshToken
    };
}

export { refreshAccessTokenService };









