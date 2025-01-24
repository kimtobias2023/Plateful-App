import jwt from 'jsonwebtoken';
import User from '../../../models/sequelize/profile/User.mjs';
import ResetToken from '../../../models/sequelize/auth/ResetToken.mjs';
import dotenv from 'dotenv';
import { sendEmailUtility } from '../../../utils/sendEmailUtility.mjs';
import { CustomError, ValidationError, AuthenticationError } from '../../../utils/errors/index.mjs';

dotenv.config();

const TOKEN_EXPIRATION_TIME = 60 * 60; // 1 hour for example

async function forgotPasswordService(email) {
    try {
        if (!email) {
            throw new ValidationError('Invalid email provided.');
        }

        // Updated field name to camelCase
        const user = await User.findOne({ where: { email: email.toLowerCase() } });

        if (!user) {
            throw new CustomError(404, 'Email not found.');
        }

        // Updated to camelCase field name
        await ResetToken.destroy({ where: { userId: user.id } });

        const resetTokenValue = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: TOKEN_EXPIRATION_TIME });

        // Create a new reset token entry
        await ResetToken.create({
            token: resetTokenValue,
            userId: user.id, // Updated to camelCase
            expiresAt: new Date(Date.now() + TOKEN_EXPIRATION_TIME * 1000) // Updated to camelCase
        });

        console.log("Generated Token:", resetTokenValue);

        const resetURL = `http://localhost:3001/reset-password/${resetTokenValue}`;
        const emailSubject = 'Password Reset Request';
        const emailMessage = `Please click the link to reset your password: ${resetURL}`;

        await sendEmailUtility(email, emailSubject, emailMessage); // Use the generic utility

        return { message: 'Password reset email sent.' };

    } catch (error) {
        console.error("Failed to process password reset request. Full error:", error);
        throw error; // It's a good practice to re-throw the error so that the caller knows an error occurred.
    }
}

export { forgotPasswordService };
