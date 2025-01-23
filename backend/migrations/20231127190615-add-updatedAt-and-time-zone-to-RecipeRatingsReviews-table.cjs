'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add updatedAt column with time zones
        await queryInterface.addColumn('RecipeRatingsReviews', 'updatedAt', {
            type: Sequelize.DATE,
            allowNull: true, // Initially allowing null for existing records
            defaultValue: Sequelize.fn('now')
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the updatedAt column
        await queryInterface.removeColumn('RecipeRatingsReviews', 'updatedAt');
    }
};

