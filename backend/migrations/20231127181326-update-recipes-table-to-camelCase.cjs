'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table to 'Recipes'
        await queryInterface.renameTable('recipes', 'Recipes');

        // Rename columns to camelCase
        await queryInterface.renameColumn('Recipes', 'recipe_name', 'recipeName');
        await queryInterface.renameColumn('Recipes', 'recipe_link', 'recipeLink');
        await queryInterface.renameColumn('Recipes', 'recipe_notes', 'recipeNotes');
        await queryInterface.renameColumn('Recipes', 'recipe_description', 'recipeDescription');
        await queryInterface.renameColumn('Recipes', 'preparation_time', 'preparationTime');
        await queryInterface.renameColumn('Recipes', 'cooking_time', 'cookingTime');
        await queryInterface.renameColumn('Recipes', 'total_time', 'totalTime');
        await queryInterface.renameColumn('Recipes', 'website_url', 'websiteUrl');
        // Continue for other columns as needed

        // Ensure createdAt and updatedAt use timezones
        await queryInterface.changeColumn('Recipes', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.changeColumn('Recipes', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Rename columns back to original names
        await queryInterface.renameColumn('Recipes', 'recipeName', 'recipe_name');
        await queryInterface.renameColumn('Recipes', 'recipeLink', 'recipe_link');
        await queryInterface.renameColumn('Recipes', 'recipeNotes', 'recipe_notes');
        await queryInterface.renameColumn('Recipes', 'recipeDescription', 'recipe_description');
        await queryInterface.renameColumn('Recipes', 'preparationTime', 'preparation_time');
        await queryInterface.renameColumn('Recipes', 'cookingTime', 'cooking_time');
        await queryInterface.renameColumn('Recipes', 'totalTime', 'total_time');
        await queryInterface.renameColumn('Recipes', 'websiteUrl', 'website_url');
        // Continue for other columns as needed

        // Revert createdAt and updatedAt columns to their original types
        await queryInterface.changeColumn('Recipes', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.changeColumn('Recipes', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false
        });

        // Rename table back to 'recipes'
        await queryInterface.renameTable('Recipes', 'recipes');
    }
};