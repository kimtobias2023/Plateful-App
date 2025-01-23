import express from 'express';
import { Recipes } from '../../controllers/index.mjs';
import { authMiddleware, recipeAuthMiddleware } from '../../middleware/index.mjs';

const router = express.Router();

// Apply authentication middleware to all recipes routes
router.use(authMiddleware);

// Recipe Routes that require recipe owner authorization for modification
router.delete('/:recipeId', recipeAuthMiddleware, Recipes.removeRecipe); // Delete a recipe
router.put('/:recipeId', recipeAuthMiddleware, Recipes.updateRecipeController); // Update an existing recipe
router.put('/:recipeId/updateLabel', recipeAuthMiddleware, Recipes.updateRecipeLabelController);

// Recipe Section Ingredient Routes that require recipe owner authorization
router.post('/sections/:sectionId/ingredient', recipeAuthMiddleware, Recipes.createRecipeIngredient); // Add ingredient to section
router.put('/sections/:sectionId/ingredient/:ingredientId', recipeAuthMiddleware, Recipes.updateRecipeIngredientInfo); // Update an ingredient
router.delete('/sections/:sectionId/ingredient/:ingredientId', recipeAuthMiddleware, Recipes.removeRecipeIngredient); // Delete an ingredient

// Recipe Section Ingredient Routes
router.get('/sections/:sectionId/ingredient/:ingredientId', recipeAuthMiddleware, Recipes.getRecipeIngredient);
router.get('/sections/:sectionId/ingredient', recipeAuthMiddleware, Recipes.getRecipeIngredientForSection);

// Recipe Routes
router.get('/search', Recipes.searchRecipeController); // For searching recipes
router.get('/', Recipes.getAllRecipeController);                // Get all recipes
router.post('/', recipeAuthMiddleware, Recipes.createRecipeController); // Create a new recipe
router.post('/scrape', authMiddleware, Recipes.recipeScrapeController);
router.get('/:recipeId/details', Recipes.getFullRecipeByIdController); // Get detailed recipe view
router.post('/:recipeId/rate', Recipes.submitRatingController);
router.get('/:recipeId', Recipes.getRecipe);           // Get basic recipe info

// RecipeLabel Routes
router.post('/labels', Recipes.createRecipeLabelController);
router.get('/labels/:labelId', Recipes.getRecipeLabelController);
router.get('/:recipeId/labels', Recipes.getLabelForRecipeController);
router.delete('/labels/:labelId', Recipes.removeRecipeLabelController);

// Recipe Media Routes
router.post('/media', Recipes.createRecipeMedia);
router.get('/media/:mediaId', Recipes.getRecipeMediaById);
router.get('/:recipeId/media', Recipes.getAllRecipeMediaForRecipe);
router.put('/media/:mediaId', Recipes.updateRecipeMediaInfo);
router.delete('/media/:mediaId', Recipes.removeRecipeMedia);



export default router;


