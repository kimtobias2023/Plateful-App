'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Previous steps remain unchanged...

        // Add a foreign key constraint to recipeId
        await queryInterface.addConstraint('RecipeMedias', {
            fields: ['recipeId'],
            type: 'foreign key',
            name: 'RecipeMedias_recipeId_fkey', // Name of the constraint
            references: {
                table: 'Recipes',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the foreign key constraint
        await queryInterface.removeConstraint('RecipeMedias', 'RecipeMedias_recipeId_fkey');

        // Rest of the down migration steps remain unchanged...
    }
};

