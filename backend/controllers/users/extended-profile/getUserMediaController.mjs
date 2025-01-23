import { getAllMediaForUser } from '../../../services/users/extended-profile/userMediaService.mjs';


export const getUserMediaController = async (req, res) => {
    const userId = req.params.userId; // Assuming the user ID is passed as a URL parameter

    try {
        // Call the service function to get all media for the user
        const media = await getAllMediaForUser(userId);

        // Construct the full URL for each media item
        const fullMediaData = media.map(item => ({
            ...item.dataValues,
            fullUrl: `${process.env.REACT_APP_S3_BASE_URL}/${item.s3Key}`
        }));

        // Send the media data as the response
        res.status(200).json(fullMediaData);
    } catch (error) {
        console.error("Error in getMediaForUserController:", error);
        res.status(500).json({ message: 'An error occurred while fetching media for the user.' });
    }
};

