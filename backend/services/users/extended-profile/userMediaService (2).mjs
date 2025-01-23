import UserMedia from '../../../models/users/extended-profile/UserMedia.mjs';
import { deleteFromS3 } from '../../../controllers/users/extended-profile/index.mjs';
async function uploadMedia(mediaData, transaction = null) {
    console.log("Media data:", mediaData);

    // Check for duplicate media URL for the same user
    const existingMedia = await UserMedia.findOne({
        where: {
            user_id: mediaData.user_id,
            media_url: mediaData.media_url
        },
        transaction
    });

    if (existingMedia) {
        throw new Error('Duplicate media URL detected for this user.');
    }

    try {
        // Ensure you include media_label in the creation call
        return await UserMedia.create({
            user_id: mediaData.user_id,
            media_url: mediaData.media_url,
            media_type: mediaData.media_type, // MIME type
            media_label: mediaData.media_label, // Descriptive label (added comma here)
            s3_key: mediaData.s3_key,
        }, { transaction });
    } catch (error) {
        console.error("Error in uploadMedia:", error);
        throw error;
    }
}

async function getUserMediaById(mediaId, transaction = null) {
    try {
        const media = await UserMedia.findByPk(mediaId, { transaction });
        if (!media) {
            throw new Error('Media not found.');
        }
        return media;
    } catch (error) {
        console.error("Error in getUserMediaById:", error);
        throw error;
    }
}

async function getAllMediaForUser(userId, transaction = null) {
    try {
        return await UserMedia.findAll({ where: { user_id: userId }, transaction });
    } catch (error) {
        console.error("Error in getAllMediaForUser:", error);
        throw error;
    }
}

async function updateMedia(mediaId, updatedData, transaction = null) {
    try {
        const result = await UserMedia.update(updatedData, {
            where: { id: mediaId },
            transaction
        });
        if (result[0] === 1) {
            return await UserMedia.findByPk(mediaId, { transaction });
        } else {
            throw new Error('Update failed or no matching media found.');
        }
    } catch (error) {
        console.error("Error in updateMedia:", error);
        throw error;
    }
}

async function deleteMedia({ mediaId, userId, mediaLabel, user }, transaction = null) {
    try {
        const media = await UserMedia.findByPk(mediaId, { transaction });
        if (!media || media.user_id !== userId) {
            return { success: false, message: 'Media not found or does not belong to the user.' };
        }

        if (user.id !== media.user_id) {
            return { success: false, message: 'Unauthorized action.' };
        }

        // Additional logic based on mediaLabel, if needed
        if (mediaLabel === 'profile_img') {
            // Specific logic for profile images
        } else if (mediaLabel === 'carousel_img') {
            // Specific logic for carousel images
        }

        if (!media.s3_key) {
            throw new Error('S3 key is missing for the media.');
        }

        await deleteFromS3(process.env.S3_BUCKET_NAME, media.s3_key);
        const result = await UserMedia.destroy({ where: { id: mediaId }, transaction });

        return result ? { success: true, message: 'Media deleted successfully.' } : { success: false, message: 'Failed to delete media.' };
    } catch (error) {
        console.error("Error in deleteMedia:", error);
        return { success: false, message: error.message };
    }
}






export {
    uploadMedia,
    getUserMediaById,
    getAllMediaForUser,
    updateMedia,
    deleteMedia
};


