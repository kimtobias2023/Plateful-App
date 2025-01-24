import IngredientShelfLife from '../models/sequelize/grocery/IngredientShelfLife.mjs'; // Update the import path as needed

/**
 * Associates a recipe section ingredient with a long shelf life item.
 * @param {number} ingredientId - ID of the ingredient.
 * @param {number} shelfLifeItemId - ID of the long shelf life item.
 */
async function ingredientShelfLifeUtil(ingredientId, shelfLifeItemId) {
    try {
        // Check if association already exists
        const existingAssociation = await IngredientShelfLife.findOne({
            where: {
                ingredientId,
                shelfLifeItemId
            }
        });

        // If association does not exist, create a new one
        if (!existingAssociation) {
            await IngredientShelfLife.create({
                ingredientId,
                shelfLifeItemId
            });
        }
    } catch (error) {
        console.error("Error in associateIngredientWithShelfLife:", error);
        throw error;
    }
}
export { ingredientShelfLifeUtil };