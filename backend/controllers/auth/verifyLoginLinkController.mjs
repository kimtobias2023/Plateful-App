// controllers/users/auth/verifyLoginLinkController.mjs
import jwt from 'jsonwebtoken';
import { verifyLoginLinkService } from './../../services/sequelize/auth/verifyLoginLinkService.mjs';
import { ValidationError } from './../../utils/errors/ValidationError.mjs';
import { AuthenticationError } from './../../utils/errors/AuthenticationError.mjs';

// controllers/users/auth/verifyLoginLinkController.mjs
const verifyLoginLinkController = async (req, res, next) => {
  try {
    const token = req.params.token;
    console.log("Backend logging: Received token in verifyLoginLinkController:", token);

    if (!token) {
      throw new ValidationError('Token not provided.');
    }

    const { message } = await verifyLoginLinkService(token);

    // Both "Email is already verified" and "Email verified successfully!"
    // are success scenarios => success = true
    return res.status(200).json({ success: true, message });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('The verification link has expired.');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid verification link.');
    } else {
      console.error('An error occurred while verifying the login link:', error);
      throw new Error('Error processing the verification link.');
    }
  }
};


export { verifyLoginLinkController };










   

   
