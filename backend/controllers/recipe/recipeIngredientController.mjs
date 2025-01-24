// Import the necessary functions from recipeSectionIngredientService
import {
    addIngredientToSection,
    getIngredientById,
    getIngredientForSection,
    updateIngredient,
    deleteIngredient
} from '../../services/sequelize/recipe/recipeIngredientService.mjs'; // Update the import path as needed

// Define your controller functions here
const createRecipeIngredient = async (req, res) => {
    try {
        const ingredientData = req.body;
        const newIngredient = await addIngredientToSection(ingredientData);
        res.status(201).json(newIngredient);
    } catch (error) {
        console.error("Error in createRecipeSectionIngredient:", error);
        res.status(500).json({ error: "Failed to create recipe section ingredient" });
    }
};

const getRecipeIngredient = async (req, res) => {
    try {
        const ingredientId = req.params.ingredientId;
        const ingredient = await getIngredientById(ingredientId);

        if (!ingredient) {
            return res.status(404).json({ error: "Recipe section ingredient not found" });
        }

        res.json(ingredient);
    } catch (error) {
        console.error("Error in getRecipeSectionIngredient:", error);
        res.status(500).json({ error: "Failed to retrieve recipe section ingredient" });
    }
};

const getRecipeIngredientForSection = async (req, res) => {
    try {
        const sectionId = req.params.sectionId;
        const ingredients = await getIngredientForSection(sectionId);
        res.json(ingredients);
    } catch (error) {
        console.error("Error in getRecipeIngredientsForSection:", error);
        res.status(500).json({ error: "Failed to retrieve recipe section ingredients" });
    }
};

const updateRecipeIngredientInfo = async (req, res) => {
    try {
        const ingredientId = req.params.ingredientId;
        const updatedData = req.body;
        const updatedIngredient = await updateIngredient(ingredientId, updatedData);

        if (!updatedIngredient) {
            return res.status(404).json({ error: "Recipe section ingredient not found" });
        }

        res.json(updatedIngredient);
    } catch (error) {
        console.error("Error in updateRecipeSectionIngredientInfo:", error);
        res.status(500).json({ error: "Failed to update recipe section ingredient" });
    }
};

const removeRecipeIngredient = async (req, res) => {
    try {
        const ingredientId = req.params.ingredientId;
        const result = await deleteIngredient(ingredientId);

        if (result === 0) {
            return res.status(404).json({ error: "Recipe section ingredient not found" });
        }

        res.json({ message: "Recipe section ingredient removed successfully" });
    } catch (error) {
        console.error("Error in removeRecipeSectionIngredient:", error);
        res.status(500).json({ error: "Failed to remove recipe section ingredient" });
    }
};

// Export the controller functions
export {
    createRecipeIngredient,
    getRecipeIngredient,
    getRecipeIngredientForSection,
    updateRecipeIngredientInfo,
    removeRecipeIngredient
};

