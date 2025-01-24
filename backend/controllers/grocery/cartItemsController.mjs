// Import the necessary functions from cartItemService
import {
    addItemToCart,
    getItemsInCart,
    updateCartItemQuantity,
    removeItemFromCart,
    removeAllItemsFromCart
} from '../../services/sequelize/grocery/cartItemService.mjs'; // Update the import path as needed

// Define your controller functions here
const addItemToShoppingCart = async (req, res) => {
    try {
        const itemData = req.body;
        const item = await addItemToCart(itemData);
        res.status(201).json(item);
    } catch (error) {
        console.error("Error in addItemToShoppingCart:", error);
        res.status(500).json({ error: "Failed to add item to shopping cart" });
    }
};

const getItemsInShoppingCart = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const items = await getItemsInCart(cartId);
        res.json(items);
    } catch (error) {
        console.error("Error in getItemsInShoppingCart:", error);
        res.status(500).json({ error: "Failed to retrieve items from shopping cart" });
    }
};

const updateCartItemQuantityInShoppingCart = async (req, res) => {
    try {
        const cartItemId = req.params.cartItemId;
        const newQuantity = req.body.quantity;
        const updatedItem = await updateCartItemQuantity(cartItemId, newQuantity);

        if (!updatedItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        res.json(updatedItem);
    } catch (error) {
        console.error("Error in updateCartItemQuantityInShoppingCart:", error);
        res.status(500).json({ error: "Failed to update cart item quantity" });
    }
};

const removeItemFromShoppingCart = async (req, res) => {
    try {
        const cartItemId = req.params.cartItemId;
        const result = await removeItemFromCart(cartItemId);

        if (result === 0) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        res.json({ message: "Cart item removed successfully" });
    } catch (error) {
        console.error("Error in removeItemFromShoppingCart:", error);
        res.status(500).json({ error: "Failed to remove cart item" });
    }
};

const removeAllItemsFromShoppingCart = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const result = await removeAllItemsFromCart(cartId);

        if (result === 0) {
            return res.status(404).json({ error: "No items found in the shopping cart" });
        }

        res.json({ message: "All items removed from the shopping cart" });
    } catch (error) {
        console.error("Error in removeAllItemsFromShoppingCart:", error);
        res.status(500).json({ error: "Failed to remove all items from the shopping cart" });
    }
};

// Export the controller functions
export {
    addItemToShoppingCart,
    getItemsInShoppingCart,
    updateCartItemQuantityInShoppingCart,
    removeItemFromShoppingCart,
    removeAllItemsFromShoppingCart
};
