// services/groceryListItemService.mjs
import GroceryListItem from '../../models/groceries/GroceryListItem.mjs';

async function addItem(itemData) {
    try {
        const newItem = await GroceryListItem.create(itemData);
        return newItem;
    } catch (error) {
        console.error("Error in addItem:", error);
        throw error;
    }
}

async function getItemById(itemId) {
    try {
        return await GroceryListItem.findByPk(itemId);
    } catch (error) {
        console.error("Error in getItemById:", error);
        throw error;
    }
}

async function getAllItemsByListId(listId) {
    try {
        return await GroceryListItem.findAll({
            where: { grocerylist_id: listId }
        });
    } catch (error) {
        console.error("Error in getAllItemsByListId:", error);
        throw error;
    }
}

async function updateItem(itemId, updatedData) {
    try {
        const result = await GroceryListItem.update(updatedData, {
            where: { id: itemId }
        });
        if (result[0] === 1) {
            return await GroceryListItem.findByPk(itemId);
        } else {
            throw new Error('Update failed or no matching grocery list item found.');
        }
    } catch (error) {
        console.error("Error in updateItem:", error);
        throw error;
    }
}

async function deleteItem(itemId) {
    try {
        const result = await GroceryListItem.destroy({
            where: { id: itemId }
        });
        return result;  // Returns the number of records deleted (should be 0 or 1)
    } catch (error) {
        console.error("Error in deleteItem:", error);
        throw error;
    }
}

export {
    addItem,
    getItemById,
    getAllItemsByListId,
    updateItem,
    deleteItem
};

