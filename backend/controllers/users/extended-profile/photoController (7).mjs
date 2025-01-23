// Assuming 'getPresignedUrl' is a function that generates a pre-signed URL for S3 upload
import { getPresignedUrl } from './s3.mjs';
import { uploadMedia, deleteMedia } from '../../../services/users/extended-profile/userMediaService.mjs';

// This endpoint generates a pre-signed URL for the client to use for direct upload to S3
export const generatePresignedUrlController = async (req, res) => {
    const { userId } = req.params;
    const { filename, contentType } = req.body; // Ensure contentType is also sent from the client

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }


    // Validate user input as necessary
    if (!filename || !contentType) {
        return res.status(400).json({ message: "Missing filename or content type." });
    }

    try {
        const presignedUrlData = await getPresignedUrl({
            userId,
            filename,
            contentType
        });
        res.json(presignedUrlData);
    } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        res.status(500).json({ message: "Error generating pre-signed URL." });
    }
};

// This endpoint is called by the client after the file is uploaded to S3 to update the database
export const confirmPhotoUploadController = async (req, res) => {
    const { userId } = req.params;
    const { photoUrl, contentType, mediaLabel, key } = req.body;

    // Validate user input
    if (!photoUrl || !contentType || !mediaLabel || !key) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        // Construct the media data object with the expected property names
        const mediaData = {
            user_id: userId,
            media_url: photoUrl,
            media_type: contentType,
            media_label: mediaLabel,
            s3_key: key // Assuming you have a column to store the S3 key
        };

        // Pass the mediaData object to the uploadMedia function
        const newMedia = await uploadMedia(mediaData);

        // Return both mediaId and key in the response
        res.json({
            success: true,
            message: "Photo URL saved successfully.",
            mediaId: newMedia.id,
            key: key // Include the key in the response
        });
    } catch (error) {
        console.error("Error saving photo URL:", error);
        res.status(500).json({ message: "Error saving photo URL." });
    }
};


export const removeProfileMediaController = async (req, res) => {
    const { userId, mediaLabel, mediaId } = req.params;

    // Parse userId and mediaId to integers if they are sent as strings
    const parsedUserId = parseInt(userId, 10);
    const parsedMediaId = parseInt(mediaId, 10);

    // Validate mediaLabel
    const validMediaLabels = ['profile_img', 'carousel_img']; // Add more labels as needed
    if (!validMediaLabels.includes(mediaLabel)) {
        return res.status(400).json({ message: "Invalid mediaLabel." });
    }

    if (isNaN(parsedUserId) || isNaN(parsedMediaId)) {
        return res.status(400).json({ message: "Invalid userId or mediaId. Must be an integer." });
    }

    try {
        const deletionResult = await deleteMedia({
            userId: parsedUserId,
            mediaId: parsedMediaId,
            mediaLabel,
            user: req.user
        });

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











