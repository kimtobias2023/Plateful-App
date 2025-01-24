// finance/cartItemService.mjs
import CartItem from '../../models/groceries/CartItem.mjs';

async function addItemToCart(itemData) {
    try {
        const item = await CartItem.create(itemData);
        return item;
    } catch (error) {
        console.error("Error in addItemToCart:", error);
        throw error;
    }
}

async function getItemsInCart(cartId) {
    try {
        return await CartItem.findAll({ where: { cart_id: cartId } });
    } catch (error) {
        console.error("Error in getItemsInCart:", error);
        throw error;
    }
}

async function updateCartItemQuantity(cartItemId, newQuantity) {
    try {
        const result = await CartItem.update({ quantity: newQuantity }, {
            where: { id: cartItemId }
        });
        if (result[0] === 1) {
            return await CartItem.findOne({ where: { id: cartItemId } });
        } else {
            throw new Error('Update failed or no matching cart item found.');
        }
    } catch (error) {
        console.error("Error in updateCartItemQuantity:", error);
        throw error;
    }
}

async function removeItemFromCart(cartItemId) {
    try {
        const result = await CartItem.destroy({
            where: { id: cartItemId }
        });
        return result;  // Returns the number of records deleted (should be 0 or 1)
    } catch (error) {
        console.error("Error in removeItemFromCart:", error);
        throw error;
    }
}

async function removeAllItemsFromCart(cartId) {
    try {
        const result = await CartItem.destroy({
            where: { cart_id: cartId }
        });
        return result;  // Returns the number of records deleted
    } catch (error) {
        console.error("Error in removeAllItemsFromCart:", error);
        throw error;
    }
}

export {
    addItemToCart,
    getItemsInCart,
    updateCartItemQuantity,
    removeItemFromCart,
    removeAllItemsFromCart
};

