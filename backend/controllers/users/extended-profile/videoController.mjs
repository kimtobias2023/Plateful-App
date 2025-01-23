import { uploadMedia } from '../../../services/users/extended-profile/userMediaService.mjs';
import { getPresignedUrl } from './s3.mjs'; // Assuming you have this function from the S3 utils

// This endpoint generates a pre-signed URL for the client to use for direct upload to S3
const generatePresignedVideoUrlController = async (req, res) => {
    const { userId } = req.params;
    const { filename } = req.body; // Client should send the filename

    // Validate filename input
    if (!filename || typeof filename !== 'string') {
        return res.status(400).json({ success: false, message: "Invalid or missing filename." });
    }

    try {
        const presignedUrlData = await getPresignedUrl({ userId, filename, contentType: 'video/*' });
        res.json(presignedUrlData);
    } catch (error) {
        console.error("Error generating pre-signed URL for video:", error);
        res.status(500).json({ success: false, message: "Error generating pre-signed URL for video." });
    }
};

// This endpoint is called by the client after the video file is uploaded to S3 to update the database
const confirmVideoUploadController = async (req, res) => {
    const { userId } = req.params;
    const { videoUrl, key } = req.body; // Client should send the final S3 URL and key of the uploaded video

    // Validate video URL input
    if (!videoUrl || typeof videoUrl !== 'string') {
        return res.status(400).json({ success: false, message: "Invalid or missing video URL." });
    }

    try {
        await uploadMedia({
            mediaType: 'video',
            userId: parseInt(userId, 10),
            mediaUrl: videoUrl,
            s3Key: key
        });

        res.json({ success: true, message: "Video URL saved successfully." });
    } catch (error) {
        console.error("Error saving video URL:", error);
        res.status(500).json({ success: false, message: "Error saving video URL." });
    }
};

export { generatePresignedVideoUrlController, confirmVideoUploadController };





