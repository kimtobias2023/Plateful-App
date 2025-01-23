import { Sequelize, Op } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';
import { Recipe, RecipeIngredientSection, RecipeInstructionSection, RecipeIngredient, RecipeInstruction, RecipeLabel, RecipeNote } from '../../models/recipes/index.mjs';


async function deleteRecipeService(recipeId, transaction = null) {
    const t = transaction || await sequelize.transaction();
    try {
        // Fetch associated entities for deletion
        const ingredientSections = await RecipeIngredientSection.findAll({
            where: { recipeId: recipeId },
            include: [{
                model: RecipeIngredient,
                as: 'RecipeIngredients'
            }],
            transaction: t
        });

        // Delete ingredients and their sections
        for (const section of ingredientSections) {
            await RecipeIngredient.destroy({
                where: { sectionId: section.id },
                transaction: t
            });
            await section.destroy({ transaction: t });
        }

        // Fetch and delete instruction sections and their instructions
        const instructionSections = await RecipeInstructionSection.findAll({
            where: { recipeId: recipeId },
            include: [{
                model: RecipeInstruction,
                as: 'RecipeInstructions'
            }],
            transaction: t
        });

        for (const section of instructionSections) {
            await RecipeInstruction.destroy({
                where: { sectionId: section.id },
                transaction: t
            });
            await section.destroy({ transaction: t });
        }

        // Delete notes associated with the recipe
        await RecipeNote.destroy({
            where: { recipeId: recipeId },
            transaction: t
        });

        // Delete labels associated with the recipe
        await RecipeLabel.destroy({
            where: { recipeId: recipeId },
            transaction: t
        });

        // Finally, delete the main recipe record
        const result = await Recipe.destroy({
            where: { id: recipeId },
            transaction: t
        });

        await t.commit();
        console.log(`Recipe ${recipeId} successfully deleted along with all associated entities.`);
        return result;  // Should be 1 if the recipe was deleted successfully
    } catch (error) {
        await t.rollback();
        console.error("Error in deleteRecipeService:", error);
        throw error;
    }
}


export { deleteRecipeService };


