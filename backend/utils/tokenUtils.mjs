import jwt from 'jsonwebtoken';

export default function generateTokenForUser(user) {
    try {
        const payload = {
            userId: user._id,
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + (60 * 60)  // Expires in 1 hour
        };
        return jwt.sign(payload, process.env.JWT_SECRET_KEY);
    } catch (err) {
        console.error('JWT Error:', err.message);
        throw new Error('Unexpected JWT signing error.');
    }
}
