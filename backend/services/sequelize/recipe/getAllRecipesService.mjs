
import { Recipe } from '../../../models/recipes/index.mjs';



async function getAllRecipesService(transaction = null) {
    try {
        return await Recipe.findAll({ transaction });
    } catch (error) {
        console.error("Error in getAllRecipes:", error);
        throw error;
    }
}



export { getAllRecipesService };


