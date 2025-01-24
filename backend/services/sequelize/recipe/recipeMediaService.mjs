import RecipeMedia from '../../../models/sequelize/recipe/RecipeMedia.mjs';

async function addMedia(mediaData, transaction = null) {
    try {
        const newMedia = await RecipeMedia.create(mediaData, { transaction });
        return newMedia;
    } catch (error) {
        console.error("Error in addMedia:", error);
        throw error;
    }
}

async function getMediaById(mediaId, transaction = null) {
    try {
        return await RecipeMedia.findByPk(mediaId, { transaction });
    } catch (error) {
        console.error("Error in getMediaById:", error);
        throw error;
    }
}

async function getAllMediaForRecipe(recipeId, transaction = null) {
    try {
        return await RecipeMedia.findAll({
            where: { recipe_id: recipeId },
            transaction
        });
    } catch (error) {
        console.error("Error in getAllMediaForRecipe:", error);
        throw error;
    }
}

async function updateMedia(mediaId, updatedData, transaction = null) {
    try {
        const result = await RecipeMedia.update(updatedData, {
            where: { id: mediaId },
            transaction
        });
        if (result[0] === 1) {
            return await RecipeMedia.findByPk(mediaId, { transaction });
        } else {
            throw new Error('Update failed or no matching media found.');
        }
    } catch (error) {
        console.error("Error in updateMedia:", error);
        throw error;
    }
}

async function deleteMedia(mediaId, transaction = null) {
    try {
        const result = await RecipeMedia.destroy({
            where: { id: mediaId },
            transaction
        });
        return result;  // Returns the number of records deleted (should be 0 or 1)
    } catch (error) {
        console.error("Error in deleteMedia:", error);
        throw error;
    }
}

// Exporting as named exports
export {
    addMedia,
    getMediaById,
    getAllMediaForRecipe,
    updateMedia,
    deleteMedia
};


