import jwt from 'jsonwebtoken';
import User from '../models/index.mjs';
import { CustomError } from '../utils/errors/CustomError.mjs';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'default_secret_key'; // Ensure to set this in your environment variables

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        if (!decoded || !decoded.userId) {
            throw new CustomError(401, 'Invalid or expired token.');
        }

        const user = await User.findByPk(decoded.userId);


        if (!user) {
            throw new CustomError(401, 'User not found with this token.');
        }

        // Attach the user to the request object
        req.user = user;
        return next();
    } catch (error) {
        if (error instanceof CustomError || error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Authentication failed. ' + error.message });
        }
        console.error("Error in authMiddleware:", error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

export { authMiddleware };













