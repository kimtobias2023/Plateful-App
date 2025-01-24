// Import the necessary functions from groceryListItemService
import {
    addItem,
    getItemById,
    getAllItemsByListId,
    updateItem,
    deleteItem
} from '../../services/sequelize/grocery/groceryListItemService.mjs'; // Update the import path as needed

// Define your controller functions here
const createGroceryListItem = async (req, res) => {
    try {
        const itemData = req.body;
        const newListItem = await addItem(itemData);
        res.status(201).json(newListItem);
    } catch (error) {
        console.error("Error in createGroceryListItem:", error);
        res.status(500).json({ error: "Failed to create grocery list item" });
    }
};

const getGroceryListItem = async (req, res) => {
    try {
        const listItemd = req.params.listItemId;
        const listItem = await getItemById(listItemd);

        if (!listItem) {
            return res.status(404).json({ error: "Grocery list item not found" });
        }

        res.json(listItem);
    } catch (error) {
        console.error("Error in getGroceryListItem:", error);
        res.status(500).json({ error: "Failed to retrieve grocery list item" });
    }
};

const getAllGroceryListItemsList = async (req, res) => {
    try {
        const listItems = await getAllItemsByListId();
        res.json(listItems);
    } catch (error) {
        console.error("Error in getAllGroceryListItemsList:", error);
        res.status(500).json({ error: "Failed to retrieve grocery list items" });
    }
};

const updateGroceryListItemInfo = async (req, res) => {
    try {
        const listItemId = req.params.listItemId;
        const updatedData = req.body;
        const updatedListItem = await updateItem(listItemId, updatedData);

        if (!updatedListItem) {
            return res.status(404).json({ error: "Grocery list item not found" });
        }

        res.json(updatedListItem);
    } catch (error) {
        console.error("Error in updateGroceryListItemInfo:", error);
        res.status(500).json({ error: "Failed to update grocery list item" });
    }
};

const removeGroceryListItem = async (req, res) => {
    try {
        const listItemId = req.params.listItemId;
        const result = await deleteItem(listItemId);

        if (result === 0) {
            return res.status(404).json({ error: "Grocery list item not found" });
        }

        res.json({ message: "Grocery list item removed successfully" });
    } catch (error) {
        console.error("Error in removeGroceryListItem:", error);
        res.status(500).json({ error: "Failed to remove grocery list item" });
    }
};

// Export the controller functions
export {
    createGroceryListItem,
    getGroceryListItem,
    getAllGroceryListItemsList,
    updateGroceryListItemInfo,
    removeGroceryListItem
};
