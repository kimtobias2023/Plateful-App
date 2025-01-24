import express from 'express';
import { Menu } from '../controllers/index.mjs';  // Import the Menu namespace
import { authMiddleware } from '../middleware/index.mjs';

const router = express.Router();

// Apply auth and permissions middleware to all meal planning routes
router.use(authMiddleware);

// Menu Routes
router.post('/menus', Menu.createMenuController);
router.get('/menus/:id', Menu.getMenuController);
router.put('/menus/:id', Menu.updateMenuController);
router.delete('/menus/:id', Menu.deleteMenuController);
router.get('/menus/user/:userId', Menu.listMenusForUserController);
router.get('/menus/user/:userId/recent', Menu.getRecentMenuByUserController); 
router.post('/menus/save', Menu.saveMenusController);

// Meal Ratings Routes
router.post('/ratings', Menu.createMealRatingEntry);
router.get('/ratings/:id', Menu.getMealRating);
router.put('/ratings/:id', Menu.updateMealRating);
router.delete('/ratings/:id', Menu.deleteMealRating);
router.get('/ratings/user/:userId', Menu.listUserMealRatings);

// MenuRecipe Routes
router.post('/recipes', Menu.addMenuRecipeController);
router.get('/recipes/:id', Menu.getMenuRecipeController);
router.put('/recipes/:id', Menu.updateMenuRecipeController);
router.delete('/recipes/:id', Menu.removeMenuRecipeController);
router.get('/recipes/menu/:menuId', Menu.getAllMenuRecipesForMenuController);


export default router;


