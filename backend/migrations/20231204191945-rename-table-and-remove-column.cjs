'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table RecipeSectionSteps to RecipeInstructions
        await queryInterface.renameTable('RecipeSectionSteps', 'RecipeInstructions');

        // Remove recipeNotes column from Recipes table
        await queryInterface.removeColumn('Recipes', 'recipeNotes');
    },

    down: async (queryInterface, Sequelize) => {
        // Revert table name to RecipeSectionSteps
        await queryInterface.renameTable('RecipeInstructions', 'RecipeSectionSteps');

        // Add recipeNotes column back to Recipes table
        await queryInterface.addColumn('Recipes', 'recipeNotes', {
            type: Sequelize.TEXT
        });
    }
};

