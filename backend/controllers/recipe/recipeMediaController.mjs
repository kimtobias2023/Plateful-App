// Import the necessary functions from recipeMediaService
import {
    addMedia,
    getMediaById,
    getAllMediaForRecipe,
    updateMedia,
    deleteMedia
} from '../../services/sequelize/recipe/recipeMediaService.mjs'; // Update the import path as needed

// Define your controller functions here
const createRecipeMedia = async (req, res) => {
    try {
        const mediaData = req.body;
        const newMedia = await addMedia(mediaData);
        res.status(201).json(newMedia);
    } catch (error) {
        console.error("Error in createRecipeMedia:", error);
        res.status(500).json({ error: "Failed to create recipe media" });
    }
};

const getRecipeMediaById = async (req, res) => {
    try {
        const mediaId = req.params.mediaId;
        const media = await getMediaById(mediaId);

        if (!media) {
            return res.status(404).json({ error: "Recipe media not found" });
        }

        res.json(media);
    } catch (error) {
        console.error("Error in getRecipeMediaById:", error);
        res.status(500).json({ error: "Failed to retrieve recipe media" });
    }
};

const getAllRecipeMediaForRecipe = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const media = await getAllMediaForRecipe(recipeId);
        res.json(media);
    } catch (error) {
        console.error("Error in getAllRecipeMediaForRecipe:", error);
        res.status(500).json({ error: "Failed to retrieve recipe media" });
    }
};

const updateRecipeMediaInfo = async (req, res) => {
    try {
        const mediaId = req.params.mediaId;
        const updatedData = req.body;
        const updatedMedia = await updateMedia(mediaId, updatedData);

        if (!updatedMedia) {
            return res.status(404).json({ error: "Recipe media not found" });
        }

        res.json(updatedMedia);
    } catch (error) {
        console.error("Error in updateRecipeMediaInfo:", error);
        res.status(500).json({ error: "Failed to update recipe media" });
    }
};

const removeRecipeMedia = async (req, res) => {
    try {
        const mediaId = req.params.mediaId;
        const result = await deleteMedia(mediaId);

        if (result === 0) {
            return res.status(404).json({ error: "Recipe media not found" });
        }

        res.json({ message: "Recipe media removed successfully" });
    } catch (error) {
        console.error("Error in removeRecipeMedia:", error);
        res.status(500).json({ error: "Failed to remove recipe media" });
    }
};

// Export the controller functions
export {
    createRecipeMedia,
    getRecipeMediaById,
    getAllRecipeMediaForRecipe,
    updateRecipeMediaInfo,
    removeRecipeMedia
};
