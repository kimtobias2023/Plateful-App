import jwt from 'jsonwebtoken';
import User from '../../../models/sequelize/profile/User.mjs';

// Function to generate a new JWT token
const generateNewToken = (user) => {
    const secretKey = process.env.JWT_SECRET_KEY || 'default-secret-key';
    const payload = {
        id: user.id,
        email: user.email,
        // Include other user information as needed
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
};

async function getProfile(userId) {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        // Assuming the profile information is part of the User model
        const userProfile = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            // Add other fields from your User model as needed
        };

        return userProfile;
    } catch (error) {
        throw new Error('Failed to fetch user profile.');
    }
}

async function updateProfile(userId, updatedProfile, res) {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        // Update user fields
        user.firstName = updatedProfile.firstName;
        user.lastName = updatedProfile.lastName;
        // Update other fields as needed

        await user.save();

        // Generate new token with updated profile data
        const token = generateNewToken(user);

        res.cookie('jwt', token, {
            httpOnly: true,
            // Add other cookie options as needed
        });

        return { profile: updatedProfile, token };
    } catch (error) {
        throw new Error('Failed to update user profile.');
    }
}

export {
    getProfile,
    updateProfile,
};

