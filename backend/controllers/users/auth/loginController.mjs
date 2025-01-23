import User from '../../../models/users/basic-profile/User.mjs';
import { loginService } from '../../../services/users/auth/loginService.mjs';
import { getAllMediaForUser } from '../../../services/users/extended-profile/userMediaService.mjs';
import { NotFoundError, AuthenticationError, ValidationError } from '../../../utils/errors/index.mjs';

async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        // Validate input for email/password login
        if (!email || !password) {
            throw new ValidationError('Email and password are required.');
        }

        // Fetch user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundError('User not found.');
        }

        // Check login attempts
        if (user.loginAttempts && user.loginAttempts >= 6) {
            throw new AuthenticationError(
                'Maximum login attempts reached. Please try again later.'
            );
        }

        // Authenticate user using email/password
        const { token, refreshToken, lastLogin } = await loginService(user, password);

        // Fetch user media
        const userMedia = await getAllMediaForUser(user.id);

        // Remove sensitive data
        const safeUser = user.get({ plain: true });
        delete safeUser.password;

        // Set cookies for JWT and refresh token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        // Regenerate session and send response
        req.session.regenerate((err) => {
            if (err) {
                console.error('Error regenerating session:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }

            const newCsrfToken = req.csrfToken();
            console.log(`New CSRF token generated after login: ${newCsrfToken}`);

            return res.json({
                success: true,
                token,
                user: { ...safeUser, lastLogin },
                userMedia,
                refreshToken,
                csrfToken: newCsrfToken,
            });
        });
    } catch (error) {
        console.error('Error during login:', error);
        const statusCode = error.httpStatus || 500;
        return res.status(statusCode).json({ message: error.message });
    }
}

export { loginController };























