'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename column 'id' to 'recipeId' in 'RecipeLabels'
        await queryInterface.renameColumn('RecipeLabels', 'id', 'recipeId');

        // Add foreign key constraint from 'RecipeLabels' to 'Recipes'
        await queryInterface.addConstraint('RecipeLabels', {
            fields: ['recipeId'],
            type: 'foreign key',
            name: 'RecipeLabels_recipeId_fkey',
            references: {
                table: 'Recipes',
                field: 'id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION'
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove foreign key constraint
        await queryInterface.removeConstraint('RecipeLabels', 'RecipeLabels_recipeId_fkey');

        // Rename column 'recipeId' back to 'id'
        await queryInterface.renameColumn('RecipeLabels', 'recipeId', 'id');
    }
};
