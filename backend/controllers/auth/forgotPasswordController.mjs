// forgotPasswordController.mjs
import { forgotPasswordService } from './../../services/sequelize/auth/index.mjs';
import { ValidationError, AuthenticationError, NotFoundError } from './../../utils/errors/index.mjs'; // Adjust the path to where your errors are defined

async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;

        const result = await forgotPasswordService(email);  // Call the service function

        return res.status(200).json(result);  // Send the response received from the service

    } catch (error) {
        console.error('Error in forgotPassword:', error);

        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message });
        } else if (error instanceof AuthenticationError) {
            return res.status(401).json({ message: error.message });
        } else if (error instanceof NotFoundError) {
            // Given the logic, you might want to return a generic message here to not disclose the presence or absence of an email
            return res.status(200).json({ message: 'If an account with this email exists, a reset link will be sent.' });
        } else {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export { forgotPasswordController };



