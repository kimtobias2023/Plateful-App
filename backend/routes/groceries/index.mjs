import express from 'express';
import { Groceries } from '../../controllers/index.mjs';  // Import the Groceries namespace
import { authMiddleware } from '../../middleware/index.mjs';

const router = express.Router();

// Apply auth and permissions middleware to all grocery routes
router.use(authMiddleware);

// Cart Items Routes
router.post('/cart', Groceries.addItemToShoppingCart);
router.get('/cart', Groceries.getItemsInShoppingCart);
router.put('/cart/:cartItemId', Groceries.updateCartItemQuantityInShoppingCart);
router.delete('/cart/:cartItemId', Groceries.removeItemFromShoppingCart);
router.delete('/cart', Groceries.removeAllItemsFromShoppingCart);

// Grocery Items Routes
router.post('/items', Groceries.createGroceryItem);
router.get('/items/:itemId', Groceries.getGroceryItem);
router.get('/items', Groceries.getAllGroceryItemsList);
router.put('/items/:itemId', Groceries.updateGroceryItemInfo);
router.delete('/items/:itemId', Groceries.removeGroceryItem);

// Grocery List Items Routes
router.post('/list-items', Groceries.createGroceryListItem);

router.get('/list-items/:listItemId', Groceries.getGroceryListItem);
router.get('/list-items', Groceries.getAllGroceryListItemsList);
router.put('/list-items/:listItemId', Groceries.updateGroceryListItemInfo);
router.delete('/list-items/:listItemId', Groceries.removeGroceryListItem);


// Grocery Lists Routes
router.post('/lists', Groceries.createGroceryListController);
router.post('/long-shelf-life/check', Groceries.checkIngredientController);
router.get('/lists/:listId', Groceries.getGroceryListController);
router.get('/lists/user/:userId', Groceries.getAllGroceryListsByUserController);
router.put('/lists/:listId', Groceries.updateGroceryListController);
router.delete('/lists/:listId', Groceries.removeGroceryListController);

export default router;


