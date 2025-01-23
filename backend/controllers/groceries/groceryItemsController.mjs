// Import the necessary functions from groceryItemService
import {
    addGroceryItem,
    getGroceryItemById,
    getAllGroceryItems,
    updateGroceryItem,
    deleteGroceryItem
} from '../../services/groceries/groceryItemService.mjs'; // Update the import path as needed

// Define your controller functions here
const createGroceryItem = async (req, res) => {
    try {
        const itemData = req.body;
        const newItem = await addGroceryItem(itemData);
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error in createGroceryItem:", error);
        res.status(500).json({ error: "Failed to create grocery item" });
    }
};

const getGroceryItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const item = await getGroceryItemById(itemId);

        if (!item) {
            return res.status(404).json({ error: "Grocery item not found" });
        }

        res.json(item);
    } catch (error) {
        console.error("Error in getGroceryItem:", error);
        res.status(500).json({ error: "Failed to retrieve grocery item" });
    }
};

const getAllGroceryItemsList = async (req, res) => {
    try {
        const items = await getAllGroceryItems();
        res.json(items);
    } catch (error) {
        console.error("Error in getAllGroceryItemsList:", error);
        res.status(500).json({ error: "Failed to retrieve grocery items" });
    }
};

const updateGroceryItemInfo = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const updatedData = req.body;
        const updatedItem = await updateGroceryItem(itemId, updatedData);

        if (!updatedItem) {
            return res.status(404).json({ error: "Grocery item not found" });
        }

        res.json(updatedItem);
    } catch (error) {
        console.error("Error in updateGroceryItemInfo:", error);
        res.status(500).json({ error: "Failed to update grocery item" });
    }
};

const removeGroceryItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const result = await deleteGroceryItem(itemId);

        if (result === 0) {
            return res.status(404).json({ error: "Grocery item not found" });
        }

        res.json({ message: "Grocery item removed successfully" });
    } catch (error) {
        console.error("Error in removeGroceryItem:", error);
        res.status(500).json({ error: "Failed to remove grocery item" });
    }
};

// Export the controller functions
export {
    createGroceryItem,
    getGroceryItem,
    getAllGroceryItemsList,
    updateGroceryItemInfo,
    removeGroceryItem
};
