import RecipeLabel from '../../../models/recipes/RecipeLabel.mjs';



async function updateRecipeLabelService(recipeId, labelIds, transaction = null) {
    try {
        // Remove all existing label associations for this recipe
        await RecipeLabel.destroy({ where: { recipeId }, transaction });

        // Add new label associations using the provided labelIds
        const labelAssociations = labelIds.map(labelId => {
            return { recipeId, labelId };
        });

        await RecipeLabel.bulkCreate(labelAssociations, { transaction });

        // Optionally, return the new associations or some confirmation
        return labelAssociations;
    } catch (error) {
        console.error("Error in updateRecipeLabelAssociations:", error);
        throw error;
    }
}



async function getRecipeLabelByIdService(recipeLabelId, transaction = null) {
    try {
        return await RecipeLabel.findByPk(recipeLabelId, { transaction });
    } catch (error) {
        console.error("Error in getRecipeLabelById:", error);
        throw error;
    }
}

async function getAllLabelsForRecipeService(recipeId, transaction = null) {
    try {
        return await RecipeLabel.findAll({
            where: { recipeId: recipeId },
            transaction
        });
    } catch (error) {
        console.error("Error in getAllLabelsForRecipe:", error);
        throw error;
    }
}


async function deleteRecipeLabelService({ recipeId, labelId }, transaction = null) {
    try {
        const result = await RecipeLabel.destroy({
            where: { recipeId, labelId },
            transaction
        });
        return result; // Returns the number of records deleted
    } catch (error) {
        console.error("Error in deleteRecipeLabelService:", error);
        throw error;
    }
}


// Exporting as named exports
export {
    updateRecipeLabelService,
    getRecipeLabelByIdService,
    getAllLabelsForRecipeService,
    deleteRecipeLabelService
};