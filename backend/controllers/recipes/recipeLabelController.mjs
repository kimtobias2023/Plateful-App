import sequelize from '../../config/sequelize-instance.mjs';
import RecipeLabel from '../../models/recipes/RecipeLabel.mjs'; // Adjust the path as necessary

import {
    updateRecipeLabelService,
    getRecipeLabelByIdService,
    getAllLabelsForRecipeService,
    deleteRecipeLabelService
} from '../../services/recipes/recipeLabelService.mjs'; // Update the import path as needed

// Define your controller functions here
const createRecipeLabelController = async (req, res) => {
    try {
        const recipeLabelData = req.body;
        const newRecipeLabel = await updateRecipeLabelService(recipeLabelData);
        res.status(201).json(newRecipeLabel);
    } catch (error) {
        console.error("Error in createRecipeLabel:", error);
        res.status(500).json({ error: "Failed to create recipe label" });
    }
};

const getRecipeLabelController = async (req, res) => {
    try {
        const recipeLabelId = req.params.recipeLabelId;
        const recipeLabel = await getRecipeLabelByIdService(recipeLabelId);

        if (!recipeLabel) {
            return res.status(404).json({ error: "Recipe label not found" });
        }

        res.json(recipeLabel);
    } catch (error) {
        console.error("Error in getRecipeLabel:", error);
        res.status(500).json({ error: "Failed to retrieve recipe label" });
    }
};

const getLabelForRecipeController = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const labels = await getAllLabelsForRecipeService(recipeId);
        res.json(labels);
    } catch (error) {
        console.error("Error in getLabelsForRecipe:", error);
        res.status(500).json({ error: "Failed to retrieve recipe labels" });
    }
};

const updateRecipeLabelController = async (req, res) => {
    const recipeId = req.params.recipeId;
    const { labelIds } = req.body;

    console.log("Received labelIds for update:", labelIds);

    if (!labelIds || !Array.isArray(labelIds)) {
        return res.status(400).json({ error: 'Invalid label data' });
    }

    let transaction;

    try {
        transaction = await sequelize.transaction();

        // Remove all existing label associations for this recipe
        await RecipeLabel.destroy({ where: { recipeId }, transaction });

        // Add new label associations
        for (const labelId of labelIds) { // Iterate over labelIds array
            await RecipeLabel.create({ recipeId, labelId }, { transaction });
        }

        await transaction.commit();
        res.status(200).json({ message: 'Labels updated successfully' });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Error in updateRecipeLabelController:', error);
        res.status(500).json({ error: 'Failed to update recipe labels', details: error.message });
    }
};



const removeRecipeLabelController = async (req, res) => {
    try {
        const recipeLabelId = req.params.recipeLabelId;
        const result = await deleteRecipeLabelService(recipeLabelId);

        if (result === 0) {
            return res.status(404).json({ error: "Recipe label not found" });
        }

        res.json({ message: "Recipe label removed successfully" });
    } catch (error) {
        console.error("Error in removeRecipeLabel:", error);
        res.status(500).json({ error: "Failed to remove recipe label" });
    }
};


export {
    createRecipeLabelController,
    getRecipeLabelController,
    getLabelForRecipeController,
    updateRecipeLabelController,
    removeRecipeLabelController
};
