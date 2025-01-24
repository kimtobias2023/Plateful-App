import UserMedia from '../../../models/sequelize/media/UserMedia.mjs';
import { deleteFromS3 } from '../../../controllers/index.mjs';

async function uploadMedia(mediaData, transaction = null) {
    console.log("Media data:", mediaData);

    // Check for duplicate S3 key for the same user
    const existingMedia = await UserMedia.findOne({
        where: {
            userId: mediaData.userId,
            s3Key: mediaData.s3Key // Check duplicates using the S3 key
        },
        transaction
    });

    if (existingMedia) {
        throw new Error('Duplicate S3 key detected for this user.');
    }

    try {
        return await UserMedia.create({
            userId: mediaData.userId,
            mediaType: mediaData.mediaType, // MIME type
            mediaLabel: mediaData.mediaLabel, // Descriptive label
            s3Key: mediaData.s3Key // Storing the S3 key
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
        return media; // Returning the media directly
    } catch (error) {
        console.error("Error in getUserMediaById:", error);
        throw error;
    }
}

async function getAllMediaForUser(userId, transaction = null) {
    try {
        const media = await UserMedia.findAll({ where: { userId: userId }, transaction });
        return media.map(item => ({
            ...item.dataValues,
            fullUrl: item.s3Key ? `${process.env.S3_BASE_URL}/${item.s3Key}` : null
        }));
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
            const updatedMedia = await UserMedia.findByPk(mediaId, { transaction });
            return updatedMedia; // Returning the updated media
        } else {
            throw new Error('Update failed or no matching media found.');
        }
    } catch (error) {
        console.error("Error in updateMedia:", error);
        throw error;
    }
}

async function deleteMedia({ mediaId, userId, user }, transaction = null) {
    try {
        const media = await UserMedia.findByPk(mediaId, { transaction });
        if (!media || media.userId !== userId) {
            return { success: false, message: 'Media not found or does not belong to the user.' };
        }

        if (user.id !== media.userId) {
            return { success: false, message: 'Unauthorized action.' };
        }

        // Additional logic for different media labels, if applicable

        if (!media.s3Key) {
            throw new Error('S3 key is missing for the media.');
        }

        await deleteFromS3(process.env.S3_BUCKET_NAME, media.s3Key);
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



