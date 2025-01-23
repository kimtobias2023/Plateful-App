import jwt from 'jsonwebtoken';
import User from '../../../models/users/basic-profile/User.mjs';
import ResetToken from '../../../models/users/auth/ResetToken.mjs';
import dotenv from 'dotenv';
import { CustomError, ValidationError, AuthenticationError } from '../../../utils/errors/index.mjs';

dotenv.config();

async function resetPasswordService(token, newPassword) {
    // Check if the token is provided
    if (!token) {
        throw new CustomError(400, 'Invalid token provided.');
    }

    // Find the reset token entry in the ResetToken table
    const resetTokenEntry = await ResetToken.findOne({ where: { token: token } });

    if (!resetTokenEntry) {
        console.log("Reset token not found in the system.");
        throw new CustomError(401, 'Reset token is invalid or has expired.');
    }

    if (!resetTokenEntry.expiresAt) {
        console.log("Token expiration timestamp is missing.");
        throw new CustomError(500, 'Server error. Please try again.');
    }

    if (Date.now() > resetTokenEntry.expiresAt.getTime()) {
        console.log("Token has expired.");
        console.log("Current Timestamp:", Date.now());
        console.log("Token's Expiry Timestamp:", resetTokenEntry.expiresAt.getTime());
        throw new CustomError(401, 'Reset token has expired.');
    }

    // Get the associated user with this reset token
    const user = await User.findByPk(resetTokenEntry.userId);

    if (!user) {
        console.log("User associated with the provided reset token not found.");
        throw new CustomError(404, 'User not found.');
    }

    // Update the user's password
    user.password = newPassword;

    // Save the updated user
    await user.save();

    // Remove the reset token entry as it's no longer needed
    await ResetToken.destroy({ where: { token: token } });

    return { message: 'Password has been reset.' };
}

export { resetPasswordService };
