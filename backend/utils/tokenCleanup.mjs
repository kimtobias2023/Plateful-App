import User from '../models/sequelize/profile/User.mjs';

async function cleanupExpiredTokens() {
    try {
        const result = await User.updateMany(
            { loginTokenExpires: { $lt: new Date() } },
            { $unset: { loginToken: 1, loginTokenExpires: 1 } }
        );

        console.log(`Cleaned up ${result.nModified} expired tokens.`);
    } catch (error) {
        console.error("Error cleaning up expired tokens:", error);
    }
}

export default cleanupExpiredTokens;
