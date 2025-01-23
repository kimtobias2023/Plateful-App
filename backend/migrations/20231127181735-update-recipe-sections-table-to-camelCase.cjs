'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table to RecipeSections
        await queryInterface.renameTable('recipe_sections', 'RecipeSections');

        // Rename columns to camelCase
        await queryInterface.renameColumn('RecipeSections', 'section_name', 'sectionName');
        await queryInterface.renameColumn('RecipeSections', 'recipe_id', 'recipeId');
        await queryInterface.renameColumn('RecipeSections', 'section_order', 'sectionOrder');

        // Update createdAt and updatedAt to use time zones
        await queryInterface.changeColumn('RecipeSections', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
        await queryInterface.changeColumn('RecipeSections', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column renaming back to original names
        await queryInterface.renameColumn('RecipeSections', 'sectionName', 'section_name');
        await queryInterface.renameColumn('RecipeSections', 'recipeId', 'recipe_id');
        await queryInterface.renameColumn('RecipeSections', 'sectionOrder', 'section_order');

        // Revert createdAt and updatedAt columns to their original types
        await queryInterface.changeColumn('RecipeSections', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.changeColumn('RecipeSections', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false
        });

        // Rename table back to 'recipe_sections'
        await queryInterface.renameTable('RecipeSections', 'recipe_sections');
    }
};

