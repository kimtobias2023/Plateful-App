// services/groceryItemService.mjs
import GroceryItem from '../../models/groceries/GroceryItem.mjs';

async function addGroceryItem(itemData) {
    try {
        const newItem = await GroceryItem.create(itemData);
        return newItem;
    } catch (error) {
        console.error("Error in addGroceryItem:", error);
        throw error;
    }
}

async function getGroceryItemById(itemId) {
    try {
        return await GroceryItem.findByPk(itemId);
    } catch (error) {
        console.error("Error in getGroceryItemById:", error);
        throw error;
    }
}

async function getAllGroceryItems() {
    try {
        return await GroceryItem.findAll();
    } catch (error) {
        console.error("Error in getAllGroceryItems:", error);
        throw error;
    }
}

async function updateGroceryItem(itemId, updatedData) {
    try {
        const result = await GroceryItem.update(updatedData, {
            where: { id: itemId }
        });
        if (result[0] === 1) {
            return await GroceryItem.findByPk(itemId);
        } else {
            throw new Error('Update failed or no matching grocery item found.');
        }
    } catch (error) {
        console.error("Error in updateGroceryItem:", error);
        throw error;
    }
}

async function deleteGroceryItem(itemId) {
    try {
        const result = await GroceryItem.destroy({
            where: { id: itemId }
        });
        return result;  // Returns the number of records deleted (should be 0 or 1)
    } catch (error) {
        console.error("Error in deleteGroceryItem:", error);
        throw error;
    }
}

export {
    addGroceryItem,
    getGroceryItemById,
    getAllGroceryItems,
    updateGroceryItem,
    deleteGroceryItem
};

