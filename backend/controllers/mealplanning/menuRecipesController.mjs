// File: controllers/mealplanning/menuRecipesController.mjs
import {
    createMenuRecipeService,
    getMenuRecipeByKeysService,
    updateMenuRecipeByKeysService,
    deleteMenuRecipeByKeysService,
    listMenuRecipeByMenuIdService
} from '../../services/mealplanning/menuRecipeService.mjs';

// Create a new menu recipe
const addMenuRecipeController = async (req, res, next) => {
    try {
        const menuRecipe = await createMenuRecipeService(req.body);
        res.status(201).json(menuRecipe);
    } catch (error) {
        next(error);
    }
};

// Get a specific menu recipe by its keys
const getMenuRecipeController = async (req, res, next) => {
    try {
        const { menuId, recipeId } = req.params; // Adjusted to match the updated table schema
        const menuRecipe = await getMenuRecipeByKeysService(menuId, recipeId);
        if (!menuRecipe) {
            return res.status(404).json({ message: 'MenuRecipe not found' });
        }
        res.status(200).json(menuRecipe);
    } catch (error) {
        next(error);
    }
};

// Update a specific menu recipe
const updateMenuRecipeController = async (req, res, next) => {
    try {
        const { menuId, recipeId } = req.params; // Adjusted to match the updated table schema
        const updatedMenuRecipe = await updateMenuRecipeByKeysService(menuId, recipeId, req.body);
        if (!updatedMenuRecipe) {
            return res.status(404).json({ message: 'MenuRecipe not found' });
        }
        res.status(200).json(updatedMenuRecipe);
    } catch (error) {
        next(error);
    }
};

// Delete a specific menu recipe
const removeMenuRecipeController = async (req, res, next) => {
    try {
        const { menuId, recipeId } = req.params; // Adjusted to match the updated table schema
        await deleteMenuRecipeByKeysService(menuId, recipeId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

// Get all menu recipes for a specific menu
const getAllMenuRecipesForMenuController = async (req, res, next) => {
    try {
        const { menuId } = req.params; // Adjusted to match the updated table schema
        const menuRecipes = await listMenuRecipeByMenuIdService(menuId);
        res.status(200).json(menuRecipes);
    } catch (error) {
        next(error);
    }
};

export {
    addMenuRecipeController,
    getMenuRecipeController,
    updateMenuRecipeController,
    removeMenuRecipeController,
    getAllMenuRecipesForMenuController
};

