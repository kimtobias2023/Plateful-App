// resetPasswordController.mjs
import { resetPasswordService } from './../../services/sequelize/auth/resetPasswordService.mjs';
import { ValidationError, AuthenticationError, NotFoundError } from './../../utils/errors/index.mjs'; // Adjust the path to where your errors are defined
async function resetPasswordController(req, res) {
    try {
        const resetToken = req.body.token;
        const newPassword = req.body.password;
        console.log('Body:', req.body);
        console.log('Token from body:', req.body.token);

        const response = await resetPasswordService(resetToken, newPassword);

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in resetPassword:', error);

        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message });
        } else if (error instanceof AuthenticationError) {
            return res.status(401).json({ message: error.message });
        } else if (error instanceof NotFoundError) {
            return res.status(404).json({ message: error.message });
        } else {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export { resetPasswordController };



