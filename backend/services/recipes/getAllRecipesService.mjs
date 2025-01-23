import { Sequelize, Op } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';
import Label from '../../models/labels/Label.mjs';
import { Recipe, RecipeIngredientSection, RecipeInstructionSection, RecipeIngredient, RecipeInstruction, RecipeRatingsReview, RecipeLabel, RecipeNote } from '../../models/recipes/index.mjs';



async function getAllRecipesService(transaction = null) {
    try {
        return await Recipe.findAll({ transaction });
    } catch (error) {
        console.error("Error in getAllRecipes:", error);
        throw error;
    }
}



export { getAllRecipesService };


