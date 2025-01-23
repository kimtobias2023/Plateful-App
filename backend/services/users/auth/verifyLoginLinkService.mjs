import jwt from 'jsonwebtoken';
import User from '../../../models/users/basic-profile/User.mjs';
import dotenv from 'dotenv';

dotenv.config();

async function verifyLoginLinkService(token) {
  try {
    console.log("Backend logging: Received token in verifyLoginLinkService:", token);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Backend logging: Decoded token:", decodedToken);

    const user = await User.findOne({ where: { id: decodedToken.userId } });
    console.log("Backend logging: User found from DB:", user);

    if (!user) {
      console.log("Backend logging: No user found with ID:", decodedToken.userId);
      throw new Error('User not found.');
    }

    if (user.isEmailVerified) {
        console.log("Backend logging: User is already verified:", user.id);
        // Instead of throwing an error, return a success response.
        return { message: 'Email is already verified.' };
      }      

    console.log("Backend logging: Updating user to isEmailVerified = true");
    user.isEmailVerified = true;

    console.log("Backend logging: Saving user...");
    await user.save();
    console.log("Backend logging: User saved successfully:", user);

    return { message: 'Email verified successfully!' };
  } catch (error) {
    // Add logs here to see the exact error
    console.error("Error in verifyLoginLinkService:", error.message);

    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('The verification link has expired.');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid verification link.');
    }
    throw new Error('Error processing the verification link.');
  }
}

export { verifyLoginLinkService };



