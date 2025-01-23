// Import the necessary functions from groceryListService
import {
    createListService,
    checkLongShelfLifeService,
    getListByIdService,
    getAllListsByUserIdService,
    updateListService,
    deleteListService
} from '../../services/groceries/groceryListService.mjs'; // Update the import path as needed


const createGroceryListController = async (req, res) => {
    console.log("Received data for grocery list:", req.body);
    try {
        const listData = req.body; // Contains user ID and recipe IDs
        const newList = await createListService(listData);

        // No need to iterate over ingredients here as createListService should handle it
        res.status(201).json(newList);
    } catch (error) {
        console.error("Error in createGroceryList:", error);
        res.status(500).json({ error: "Failed to create grocery list" });
    }
};


const checkIngredientController = async (req, res) => {
    try {
        const { ingredientName } = req.body;
        const isLongShelfLife = await checkLongShelfLifeService(ingredientName);
        res.json({ isLongShelfLife });
    } catch (error) {
        console.error("Error in checkIngredient:", error);
        res.status(500).send("Failed to check ingredient shelf life.");
    }
};

const getGroceryListController = async (req, res) => {
    try {
        const listId = req.params.listId;
        const list = await getListByIdService(listId);

        if (!list) {
            return res.status(404).json({ error: "Grocery list not found" });
        }

        res.json(list);
    } catch (error) {
        console.error("Error in getGroceryList:", error);
        res.status(500).json({ error: "Failed to retrieve grocery list" });
    }
};

const getAllGroceryListsByUserController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const lists = await getAllListsByUserIdService(userId);
        res.json(lists);
    } catch (error) {
        console.error("Error in getAllGroceryListsByUser:", error);
        res.status(500).json({ error: "Failed to retrieve grocery lists" });
    }
};


const updateGroceryListController = async (req, res) => {
    try {
        const listId = req.params.listId;
        const updatedData = req.body;
        const updatedList = await updateListService(listId, updatedData);

        if (!updatedList) {
            return res.status(404).json({ error: "Grocery list not found" });
        }

        res.json(updatedList);
    } catch (error) {
        console.error("Error in updateGroceryListInfo:", error);
        res.status(500).json({ error: "Failed to update grocery list" });
    }
};

const removeGroceryListController = async (req, res) => {
    try {
        const listId = req.params.listId;
        const result = await deleteListService(listId);

        if (result === 0) {
            return res.status(404).json({ error: "Grocery list not found" });
        }

        res.json({ message: "Grocery list removed successfully" });
    } catch (error) {
        console.error("Error in removeGroceryList:", error);
        res.status(500).json({ error: "Failed to remove grocery list" });
    }
};

// Export the controller functions
export {
    createGroceryListController,
    checkIngredientController,
    getGroceryListController,
    getAllGroceryListsByUserController,
    updateGroceryListController,
    removeGroceryListController
};
