import MenuRecipe from '../../models/sequelize/menu/MenuRecipe.mjs';

const createMenuRecipeService = async (menuRecipeData) => {
    try {
        const menuRecipe = await MenuRecipe.create(menuRecipeData);
        return menuRecipe;
    } catch (error) {
        throw error;
    }
};

const getMenuRecipeByKeysService = async (menuId, recipeId) => {
    try {
        const menuRecipe = await MenuRecipe.findOne({
            where: { menuId, recipeId }
        });
        return menuRecipe;
    } catch (error) {
        throw error;
    }
};

const updateMenuRecipeByKeysService = async (menuId, recipeId, updateData) => {
    try {
        const menuRecipe = await MenuRecipe.update(updateData, {
            where: { menuId, recipeId }
        });
        return menuRecipe;
    } catch (error) {
        throw error;
    }
};

const deleteMenuRecipeByKeysService = async (menuId, recipeId) => {
    try {
        await MenuRecipe.destroy({
            where: { menuId, recipeId }
        });
    } catch (error) {
        throw error;
    }
};

const listMenuRecipeByMenuIdService = async (menuId) => {
    try {
        const menuRecipes = await MenuRecipe.findAll({
            where: { menuId }
        });
        return menuRecipes;
    } catch (error) {
        throw error;
    }
};

export {
    createMenuRecipeService,
    getMenuRecipeByKeysService,
    updateMenuRecipeByKeysService,
    deleteMenuRecipeByKeysService,
    listMenuRecipeByMenuIdService
};