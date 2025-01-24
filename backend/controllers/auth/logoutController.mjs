import { logoutService } from './../../services/sequelize/auth/logoutService.mjs';
import { CustomError } from './../../utils/errors/index.mjs';
import { logger } from './../../utils/logger.mjs';  // Assuming you have a logger utility

async function logoutController(req, res, next) {
    try {
        const result = await logoutService(req);  // Pass the entire request to the service

        // Options for clearing cookies
        const cookieOptions = {
            httpOnly: true,
            path: '/', // specify the path if set during creation
            secure: process.env.NODE_ENV === 'production',  // Ensure secure only in production
            sameSite: 'strict', // Set sameSite attribute for security
        };

        // Clear the refreshToken and _csrf cookies
        res.clearCookie('refreshToken', cookieOptions);

        // Set the new CSRF token in the response headers after successful logout.
        res.setHeader('x-csrf-token', req.csrfToken()); // Generate a new CSRF token using the `csurf` middleware.

        // Include the new session ID as well (if desired):
        res.setHeader('x-session-id', req.sessionID);

        // Invalidate the current session
        req.session.destroy(err => {
            if (err) {
                logger.error('Failed to destroy session:', err);
                return next(err);  // forward error to the error handling middleware
            }

            logger.info('User successfully logged out.'); // Log the successful logout

            // Respond to the client
            return res.status(200).json({
                message: 'Logged out successfully',
                ...result
            });
        });

    } catch (error) {
        logger.error('Error during logout:', error);  // Log the error

        // If the error is a CustomError from your middleware, handle it appropriately.
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        // For unexpected errors, forward them to your global error handling middleware.
        return next(error);
    }
}

export { logoutController };






