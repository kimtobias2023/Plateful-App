// Assuming 'getPresignedUrl' is a function that generates a pre-signed URL for S3 upload
import { getPresignedUrl } from './s3.mjs';
import UserMedia from '../../../models/users/extended-profile/UserMedia.mjs';
import { deleteMedia, updateMedia, uploadMedia } from '../../../services/users/extended-profile/userMediaService.mjs';

// Generate a pre-signed URL for S3 upload
export const generatePresignedUrlController = async (req, res) => {
    const { userId } = req.params;
    const { filename, contentType } = req.body;

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!filename || !contentType) {
        return res.status(400).json({ message: "Missing filename or content type." });
    }

    try {
        const presignedUrlData = await getPresignedUrl({ userId, filename, contentType });
        res.json(presignedUrlData);
    } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        res.status(500).json({ message: "Error generating pre-signed URL." });
    }
};

export const confirmPhotoUploadController = async (req, res) => {
    const { userId } = req.params;
    const { s3Key, contentType, mediaLabel, mediaId } = req.body;

    console.log(`Received data for userId ${userId}:`, { s3Key, contentType, mediaLabel, mediaId });

    // Check for required fields
    if (!s3Key || !contentType || !mediaLabel) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    const fullUrl = `${process.env.S3_BASE_URL}/${s3Key}`;
    const mediaData = {
        userId,
        s3Key,
        fullUrl,
        mediaType: contentType,
        mediaLabel
    };

    try {
        let responseMedia;

        // Check if mediaId is provided, indicating an update
        if (mediaId) {
            const existingMedia = await UserMedia.findOne({ where: { userId, id: mediaId } });
            if (existingMedia) {
                // Existing media found, so update it
                responseMedia = await updateMedia(existingMedia.id, mediaData);
            } else {
                // Provided mediaId does not exist, handle accordingly (e.g., error response)
                return res.status(404).json({ message: "Media to update not found." });
            }
        } else {
            // No mediaId provided, treat as a new upload
            responseMedia = await uploadMedia(mediaData);
        }

        res.json({
            success: true,
            message: "Photo uploaded and saved successfully.",
            mediaId: responseMedia.id,
            fullUrl,
            s3Key
        });
    } catch (error) {
        console.error("Error in photo upload confirmation:", error);
        res.status(500).json({ message: "Error saving photo." });
    }
};





// Remove a user's profile media
export const removeProfileMediaController = async (req, res) => {
    const { userId, mediaLabel, mediaId } = req.params;

    const parsedUserId = parseInt(userId, 10);
    const parsedMediaId = parseInt(mediaId, 10);

    const validMediaLabels = ['profile_img', 'carousel_img'];
    if (!validMediaLabels.includes(mediaLabel)) {
        return res.status(400).json({ message: "Invalid mediaLabel." });
    }

    if (isNaN(parsedUserId) || isNaN(parsedMediaId)) {
        return res.status(400).json({ message: "Invalid userId or mediaId. Must be an integer." });
    }

    try {
        const deletionResult = await deleteMedia({ userId: parsedUserId, mediaId: parsedMediaId, mediaLabel, user: req.user });
        if (deletionResult && deletionResult.success) {
            res.json({ message: deletionResult.message || 'Profile media removed successfully.' });
        } else {
            res.status(deletionResult.statusCode || 400).json({ message: deletionResult.message || 'An unexpected error occurred.' });
        }
    } catch (error) {
        console.error("Error removing profile media:", error);
        res.status(500).json({ message: error.message || "Error removing profile media." });
    }
};












