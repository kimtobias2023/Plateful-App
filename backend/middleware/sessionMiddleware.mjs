import { validateSession } from '../mongo/services/sessionService.mjs';
import User from '../models/users/basic-profile/User.mjs';

const sessionMiddleware = async (req, res, next) => {
  try {
    const loginToken = req.headers.authorization?.split(' ')[1]; // Extract token

    if (!loginToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate session
    const userId = await validateSession(loginToken);

    // Attach the Sequelize user to the request object
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    req.user = user; // Attach user for use in controllers
    next();
  } catch (error) {
    console.error('Error in sessionMiddleware:', error);
    res.status(401).json({ message: error.message });
  }
};

export { sessionMiddleware };
