import { Sequelize, Op } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';
import { Recipe } from '../../models/recipes/index.mjs';

async function getRecipeByIdService(recipeId, transaction = null) {
    try {
        const recipe = await Recipe.findByPk(recipeId, {
            include: [{
                model: User,
                as: 'user', // Use the same alias as defined in the association
                attributes: ['id'] // Fetch only necessary attributes
            }],
            transaction
        });

        if (!recipe) {
            throw new CustomError(404, `Recipe not found with ID: ${recipeId}`);
        }

        return recipe;
    } catch (error) {
        console.error(`Error in getRecipeById for recipe ID ${recipeId}:`, error);
        throw new CustomError(500, 'Failed to retrieve recipe');
    }
}


export { getRecipeByIdService };


