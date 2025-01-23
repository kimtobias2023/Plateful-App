import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import validator from 'validator';
import User from '../../../models/users/basic-profile/User.mjs';
import Role from '../../../models/users/auth/Role.mjs';
import { sendEmailUtility } from '../../../utils/sendEmailUtility.mjs';
import { ValidationError, CustomError } from '../../../utils/errors/index.mjs';
import { validatePasswordStrength } from '../../../utils/validations/passwordAndEmailValidation.mjs';

async function registerService(userData) {
    try {
        // Normalize the email
        const email = userData.email?.toLowerCase().trim();

        // Validate the email
        if (!email || !validator.isEmail(email)) {
            console.error(`Invalid email provided: ${email}`);
            throw new ValidationError('Invalid email provided.');
        }

        // Validate the password strength
        try {
            validatePasswordStrength(userData.password);
        } catch (passwordError) {
            console.error(`Password validation failed: ${passwordError.message}`);
            throw new ValidationError(passwordError.message);
        }

        // Check if a user with the given email exists
        const existingUserByEmail = await User.findOne({ where: { email } });
        if (existingUserByEmail) {
            console.error(`Email already in use: ${email}`);
            throw new ValidationError('Email is already in use.');
        }

        // Fetch the 'User' role
        const userRole = await Role.findOne({ where: { name: 'User' } });
        if (!userRole) {
            console.error('User role not found in the database.');
            throw new CustomError(500, 'User role not found in the database.');
        }

        // Constructing the new user
        const newUser = User.build({
            firstName: userData.firstName?.trim(),
            lastName: userData.lastName?.trim() || '',
            email,
            password: userData.password,
            roleId: userRole.id, // Assigning the role ID here
            isEmailVerified: false,
            verificationToken: crypto.randomBytes(32).toString('hex'),
        });

        await newUser.save();
        console.log(`Registered user: ${newUser.email}`);

        // Generate verification token and email content
        const verificationToken = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Use the FRONTEND_URL for verification link
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081'; // Replace with the default Expo dev server URL if needed

        // Construct the verification link
        const verificationLink = `${frontendUrl}/verify-email/${verificationToken}`;


        // Construct the email content
        const emailContent = `
            <p>Thank you for signing up!</p>
            <p>Please verify your email address by clicking the link below:</p>
            <p><a href="${verificationLink}">Verify Email</a></p>
            <p>This link will expire in 24 hours.</p>
        `;

        // Log verification link for debugging
        console.log('Verification link:', verificationLink);

        // Send the verification email
        try {
            await sendEmailUtility(newUser.email, 'Verify Your Email', emailContent);
            console.log('Verification email sent successfully.');
        } catch (emailError) {
            console.error(`Failed to send verification email: ${emailError.message}`);
            throw new CustomError(500, 'Failed to send verification email.');
        }

        // Return user without sensitive data
        const { password, ...userWithoutPassword } = newUser.get({ plain: true });
        return userWithoutPassword;
    } catch (error) {
        if (error instanceof ValidationError || error instanceof CustomError) {
            console.error(`Known error occurred: ${error.message}`);
            throw error; // Re-throw known errors
        }

        console.error(`Unexpected error in registerService: ${error.message}`, error.stack);
        throw new CustomError(500, `An unexpected error occurred. Reason: ${error.message}`);
    }
}

export { registerService };
