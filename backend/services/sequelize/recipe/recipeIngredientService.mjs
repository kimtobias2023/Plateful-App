// Import the RecipeSectionIngredient model
import RecipeIngredient from '../../../models/sequelize/recipe/RecipeIngredient.mjs';

// Function to add a new ingredient to a section
const addIngredientToSection = async (ingredientData) => {
    return await RecipeIngredient.create(ingredientData);
};

// Function to get an ingredient by its ID
const getIngredientById = async (ingredientId) => {
    return await RecipeIngredient.findByPk(ingredientId);
};

// Function to get ingredients for a specific section
const getIngredientForSection = async (sectionId) => {
    return await RecipeIngredient.findAll({
        where: {
            sectionId: sectionId
        }
    });
};

// Function to update an ingredient
const updateIngredient = async (ingredientId, updatedData) => {
    const ingredient = await RecipeIngredient.findByPk(ingredientId);
    if (ingredient) {
        return await ingredient.update(updatedData);
    }
    return null;
};

// Function to delete an ingredient
const deleteIngredient = async (ingredientId) => {
    return await RecipeIngredient.destroy({
        where: {
            id: ingredientId
        }
    });
};

// Export the service functions
export {
    addIngredientToSection,
    getIngredientById,
    getIngredientForSection,
    updateIngredient,
    deleteIngredient
};

