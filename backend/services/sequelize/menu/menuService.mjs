import { Menu, MenuRecipe } from '../../models/sequelize/menu/index.mjs';
import { Recipe } from '../../models/sequelize/recipe/index.mjs';
import { Op } from 'sequelize';

const createMenuService = async (menuData) => {
    try {
        // Create the menu in the Menus table
        const menu = await Menu.create({
            userId: menuData.userId,
            startDate: menuData.startDate,
            endDate: menuData.endDate,
            menuName: menuData.menuName,
            isActive: true // Assuming you have an isActive column
        });

        console.log(`Created new menu ID ${menu.id}:`, menuData);

        // Only proceed if there are recipes to associate
        if (menuData.recipes && menuData.recipes.length > 0) {
            const recipeIds = menuData.recipes; // Assuming this is an array of string IDs
            console.log(`Extracted recipe IDs for new menu ID ${menu.id}:`, recipeIds);

            const menuRecipesData = recipeIds.map(recipeId => ({
                menuId: menu.id,
                recipeId: parseInt(recipeId, 10) // Convert string IDs to integers
            }));

            await MenuRecipe.bulkCreate(menuRecipesData, { validate: true });
            console.log(`MenuRecipes entries created for menu ID ${menu.id}`);
        }


        const fullMenu = await Menu.findByPk(menu.id, {
            include: [{
                model: Recipe,
                as: 'Recipes'
            }]
        });

        return fullMenu;
    } catch (error) {
        console.error('Error in createMenuService:', error);
        throw error;
    }
};



const saveMenusService = async (menus) => {
    try {
        console.log("Received menus to save:", JSON.stringify(menus, null, 2));

        const savedMenus = await Promise.all(menus.map(async (menuData) => {
            console.log(`Processing menu:`, JSON.stringify(menuData, null, 2));

            if (menuData.id) {
                // Update existing menu
                console.log(`Attempting to update menu ID ${menuData.id} with data:`, JSON.stringify(menuData, null, 2));
                const updatedMenu = await updateMenuByIdService(menuData.id, menuData);
                console.log(`Updated menu ID ${menuData.id}:`, JSON.stringify(updatedMenu, null, 2));
                return updatedMenu;
            } else {
                // Create new menu
                console.log(`Creating new menu with data:`, JSON.stringify(menuData, null, 2));
                const newMenu = await createMenuService(menuData);
                console.log(`Created new menu:`, JSON.stringify(newMenu, null, 2));
                return newMenu;
            }
        }));

        console.log("Saved menus:", JSON.stringify(savedMenus, null, 2));
        return savedMenus;
    } catch (error) {
        console.error('Error in saveMenusService:', error);
        throw error;
    }
};


const getRecentMenuByUserService = async (userId) => {
    const currentDate = new Date(); // Current date for comparison

    try {
        const activeMenus = await Menu.findAll({
            where: {
                userId: userId,
                isActive: true, // Only consider active menus
                endDate: {
                    [Op.gte]: currentDate // Exclude expired menus
                }
            },
            include: [{
                model: Recipe,
                as: 'Recipes', // Use the alias defined in the association
                through: {
                    attributes: [] // Exclude attributes from the join table if not needed
                }
            }],
            order: [['createdAt', 'DESC']] // Sort by creation date in descending order
        });

        console.log("Fetched recent menus from database:", activeMenus);
        return activeMenus;
    } catch (error) {
        throw error;
    }
};


const getMenuByIdService = async (menuId) => {
    try {
        const menu = await Menu.findByPk(menuId);
        return menu;
    } catch (error) {
        throw error;
    }
};

const updateMenuByIdService = async (menuId, updateData) => {
    try {
        const menu = await Menu.findByPk(menuId);
        if (menu) {
            await menu.update(updateData);

            // Update recipe associations
            if (updateData.Recipes && Array.isArray(updateData.Recipes)) {
                // Since updateData.Recipes is already an array of IDs, use it directly
                const recipeIds = updateData.Recipes;

                // Validate recipeIds and log
                if (recipeIds.every(id => typeof id === 'number' && !isNaN(id))) {
                    await menu.setRecipes(recipeIds);
                    console.log(`Updated recipes for menu ID ${menuId}:`, recipeIds);
                } else {
                    console.error(`Invalid recipe IDs for menu ID ${menuId}:`, recipeIds);
                }
            }

            return menu.reload();
        } else {
            console.log(`Menu ID ${menuId} not found.`);
            return null;
        }
    } catch (error) {
        console.error(`Error updating menu ID ${menuId}:`, error);
        throw error;
    }
};


const deleteMenuByIdService = async (menuId) => {
    try {
        const menu = await Menu.findByPk(menuId);
        if (menu) {
            // Delete associated MenuRecipe records first
            await MenuRecipe.destroy({ where: { menuId } });

            // Then delete the Menu
            await menu.destroy();
            return { message: 'Menu deleted successfully.' };
        }
        return null; // Menu not found
    } catch (error) {
        throw error;
    }
};


const listMenuByUserIdService = async (userId) => {
    try {
        const menus = await Menu.findAll({
            where: { userId }
        });
        return menus;
    } catch (error) {
        throw error;
    }
};

export {
    createMenuService,
    getMenuByIdService,
    updateMenuByIdService,
    deleteMenuByIdService,
    listMenuByUserIdService,
    getRecentMenuByUserService,
    saveMenusService
};

