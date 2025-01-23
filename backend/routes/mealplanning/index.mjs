import express from 'express';
import { MealPlanning } from '../../controllers/index.mjs';  // Import the MealPlanning namespace
import { authMiddleware } from '../../middleware/index.mjs';

const router = express.Router();

// Apply auth and permissions middleware to all meal planning routes
router.use(authMiddleware);



// Menu Routes
router.post('/menus', MealPlanning.createMenuController);
router.get('/menus/:id', MealPlanning.getMenuController);
router.put('/menus/:id', MealPlanning.updateMenuController);
router.delete('/menus/:id', MealPlanning.deleteMenuController);
router.get('/menus/user/:userId', MealPlanning.listMenusForUserController);
router.get('/menus/user/:userId/recent', MealPlanning.getRecentMenuByUserController); 
router.post('/menus/save', MealPlanning.saveMenusController);

// Meal Ratings Routes
router.post('/ratings', MealPlanning.createMealRatingEntry);
router.get('/ratings/:id', MealPlanning.getMealRating);
router.put('/ratings/:id', MealPlanning.updateMealRating);
router.delete('/ratings/:id', MealPlanning.deleteMealRating);
router.get('/ratings/user/:userId', MealPlanning.listUserMealRatings);

// MenuRecipe Routes
router.post('/recipes', MealPlanning.addMenuRecipeController);
router.get('/recipes/:id', MealPlanning.getMenuRecipeController);
router.put('/recipes/:id', MealPlanning.updateMenuRecipeController);
router.delete('/recipes/:id', MealPlanning.removeMenuRecipeController);
router.get('/recipes/menu/:menuId', MealPlanning.getAllMenuRecipesForMenuController);


export default router;


