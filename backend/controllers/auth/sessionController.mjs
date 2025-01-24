import User from './../../models/sequelize/profile/User.mjs';
import { getAllMediaForUser } from './../../services/sequelize/media/userMediaService.mjs';

export const validateSessionController = async (req, res) => {
    // Check if there's an active session with a userId
    if (req.session && req.session.userId) {
        try {
            // Fetch the latest user data
            const user = await User.findById(req.session.userId);
            if (!user) {
                // If user not found, invalidate the session
                req.session.destroy();
                return res.status(401).json({ message: "User not found. Session invalidated." });
            }

            // Fetch the latest media data
            const userMedia = await getAllMediaForUser(req.session.userId);
            const userMediaWithFullUrl = userMedia.map(media => ({
                ...media.dataValues,
                fullUrl: `${process.env.S3_BASE_URL}/${media.s3Key}`
            }));

            // Create a safe user object without sensitive data
            const safeUser = user.toObject();
            delete safeUser.password;

            // Respond with the latest user and media data
            res.json({ user: safeUser, userMedia: userMediaWithFullUrl });
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.status(500).json({ message: "Failed to fetch user data." });
        }
    } else {
        // If there's no active session or userId
        res.status(401).json({ message: "No active session." });
    }
};

