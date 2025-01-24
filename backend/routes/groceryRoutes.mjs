import express from 'express';
import { Grocery } from '../controllers/index.mjs';  // Import the Grocery namespace
import { authMiddleware } from '../middleware/index.mjs';

const router = express.Router();

// Apply auth and permissions middleware to all grocery routes
router.use(authMiddleware);

// Cart Items Routes
router.post('/cart', Grocery.addItemToShoppingCart);
router.get('/cart', Grocery.getItemsInShoppingCart);
router.put('/cart/:cartItemId', Grocery.updateCartItemQuantityInShoppingCart);
router.delete('/cart/:cartItemId', Grocery.removeItemFromShoppingCart);
router.delete('/cart', Grocery.removeAllItemsFromShoppingCart);

// Grocery Items Routes
router.post('/items', Grocery.createGroceryItem);
router.get('/items/:itemId', Grocery.getGroceryItem);
router.get('/items', Grocery.getAllGroceryItemsList);
router.put('/items/:itemId', Grocery.updateGroceryItemInfo);
router.delete('/items/:itemId', Grocery.removeGroceryItem);

// Grocery List Items Routes
router.post('/list-items', Grocery.createGroceryListItem);

router.get('/list-items/:listItemId', Grocery.getGroceryListItem);
router.get('/list-items', Grocery.getAllGroceryListItemsList);
router.put('/list-items/:listItemId', Grocery.updateGroceryListItemInfo);
router.delete('/list-items/:listItemId', Grocery.removeGroceryListItem);


// Grocery Lists Routes
router.post('/lists', Grocery.createGroceryListController);
router.post('/long-shelf-life/check', Grocery.checkIngredientController);
router.get('/lists/:listId', Grocery.getGroceryListController);
router.get('/lists/user/:userId', Grocery.getAllGroceryListsByUserController);
router.put('/lists/:listId', Grocery.updateGroceryListController);
router.delete('/lists/:listId', Grocery.removeGroceryListController);

export default router;


