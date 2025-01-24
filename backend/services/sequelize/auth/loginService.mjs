import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import RefreshToken from '../../../models/users/auth/RefreshToken.mjs';
import { CustomError, AuthenticationError } from '../../../utils/errors/index.mjs';


async function loginService(user, password, authCode = null, codeVerifier = null) {
    try {
        if (authCode) {
            // Handle Google OAuth login
            return await handleGoogleLogin(authCode, codeVerifier);
        }

        // Regular email/password login
        return await handleEmailPasswordLogin(user, password);
    } catch (error) {
        console.error(`Login failed: ${error.message}`);
        throw new CustomError(500, `Login failed: ${error.message}`);
    }
}

async function handleEmailPasswordLogin(user, password) {
    if (!user.isEmailVerified) {
        throw new AuthenticationError('Email not verified');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        user.loginAttempts += 1;
        await user.save();
        throw new CustomError(401, 'Invalid password');
    }

    user.loginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    return await generateTokens(user);
}

async function generateTokens(user) {
    const token = generateJWT(user);

    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    // Clear existing refresh tokens for the user
    await RefreshToken.destroy({ where: { userId: user.id } });

    // Create a new refresh token
    await RefreshToken.create({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
        token,
        refreshToken,
        lastLogin: user.lastLogin,
    };
}

// Helper function to generate JWT
function generateJWT(user) {
    const payload = {
        id: user.id,
        email: user.email,
    };

    if (!process.env.JWT_SECRET_KEY) {
        throw new Error('JWT_SECRET_KEY is not defined');
    }

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
}

export { loginService };



