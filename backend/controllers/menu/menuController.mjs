// File: controllers/sequelize/menu/menusController.mjs
import {
    createMenuService,
    getMenuByIdService,
    updateMenuByIdService,
    deleteMenuByIdService,
    listMenuByUserIdService,
    getRecentMenuByUserService,
    saveMenusService
} from '../../services/sequelize/menu/menuService.mjs';

// Create a new menu
const createMenuController = async (req, res, next) => {
    try {
        const menu = await createMenuService(req.body);
        res.status(201).json(menu); // Send back the new menu with recipes and ID
    } catch (error) {
        console.error('Failed to create menu:', error);
        next(error); // Pass the error to your error-handling middleware
    }
};

const saveMenusController = async (req, res, next) => {
    try {
        const menus = req.body; // Expecting an array of menus
        console.log("Received menus to save:", menus); // Log the incoming menus

        const savedMenus = await saveMenusService(menus);
        console.log("Saved menus:", savedMenus); // Log the saved menus

        res.status(200).json(savedMenus);
    } catch (error) {
        console.error('Failed to save menus:', error);
        next(error);
    }
};


// Get a menu by ID
const getMenuController = async (req, res, next) => {
    try {
        const menuId = req.params.id;
        const menu = await getMenuByIdService(menuId);
        if (!menu) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        res.status(200).json(menu);
    } catch (error) {
        next(error);
    }
};

const getRecentMenuByUserController = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const recentMenu = await getRecentMenuByUserService(userId);
        console.log("Fetched recent menu:", recentMenu); // Add this log
        if (!recentMenu) {
            return res.status(404).json({ message: 'No recent active menu found for this user' });
        }
        res.status(200).json(recentMenu);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the recent active menu', error: error.message });
    }
};

// Update a menu by ID
const updateMenuController = async (req, res, next) => {
    try {
        const menuId = req.params.id;
        const updateData = req.body;
        const menu = await updateMenuByIdService(menuId, updateData);
        if (!menu) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        res.status(200).json(menu);
    } catch (error) {
        next(error);
    }
};

// Delete a menu by ID
const deleteMenuController = async (req, res, next) => {
    try {
        const menuId = req.params.id;
        const result = await deleteMenuByIdService(menuId);
        if (!result) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        res.status(204).json(result);
    } catch (error) {
        next(error);
    }
};

// List menus by user ID
const listMenusForUserController = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const menus = await listMenuByUserIdService(userId);
        res.status(200).json(menus);
    } catch (error) {
        next(error);
    }
};

export {
    createMenuController,
    getMenuController,
    updateMenuController,
    deleteMenuController,
    listMenusForUserController,
    getRecentMenuByUserController,
    saveMenusController
};

