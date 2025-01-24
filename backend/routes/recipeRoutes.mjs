import express from 'express';
import { Recipes } from './../controllers/index.mjs';
import { authMiddleware, recipeAuthMiddleware } from './../middleware/index.mjs';

const router = express.Router();

// Apply authentication middleware to all recipes routes
router.use(authMiddleware);

router.get('/search', Recipes.searchRecipeController); // For searching recipes
router.get('/', Recipes.getAllRecipeController); // Get all recipes
router.get('/:recipeId/details', Recipes.getFullRecipeByIdController); // Get detailed recipe view
router.post('/:recipeId/rate', Recipes.submitRatingController);
router.get('/:recipeId', Recipes.getRecipe);           // Get basic recipe info
router.post('/scrape', Recipes.recipeScrapeController);

router.post('/media', Recipes.createRecipeMedia);
router.get('/media/:mediaId', Recipes.getRecipeMediaById);
router.get('/:recipeId/media', Recipes.getAllRecipeMediaForRecipe);
router.put('/media/:mediaId', Recipes.updateRecipeMediaInfo);
router.delete('/media/:mediaId', Recipes.removeRecipeMedia);

router.post('/labels', Recipes.createRecipeLabelController);
router.get('/labels/:labelId', Recipes.getRecipeLabelController);
router.get('/:recipeId/labels', Recipes.getLabelForRecipeController);
router.delete('/labels/:labelId', Recipes.removeRecipeLabelController);

router.use(authMiddleware, recipeAuthMiddleware);


// Recipe Routes that require recipe owner authorization for modification
router.delete('/:recipeId', Recipes.removeRecipe); // Delete a recipe
router.put('/:recipeId', Recipes.updateRecipeController); // Update an existing recipe
router.put('/:recipeId/updateLabel', Recipes.updateRecipeLabelController);

// Recipe Section Ingredient Routes that require recipe owner authorization
router.post('/sections/:sectionId/ingredient', Recipes.createRecipeIngredient); // Add ingredient to section
router.put('/sections/:sectionId/ingredient/:ingredientId', Recipes.updateRecipeIngredientInfo); // Update an ingredient
router.delete('/sections/:sectionId/ingredient/:ingredientId', Recipes.removeRecipeIngredient); // Delete an ingredient

// Recipe Section Ingredient Routes
router.get('/sections/:sectionId/ingredient/:ingredientId', Recipes.getRecipeIngredient);
router.get('/sections/:sectionId/ingredient', Recipes.getRecipeIngredientForSection);
router.post('/', Recipes.createRecipeController); // Create a new recipe

export default router;


