'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename the table to 'FoodSynonyms'
        await queryInterface.renameTable('food_synonyms', 'FoodSynonyms');

        // Rename columns to camelCase
        await queryInterface.renameColumn('FoodSynonyms', 'food_name', 'foodName');
        await queryInterface.renameColumn('FoodSynonyms', 'standardized_name', 'standardizedName');

        // Update createdAt and updatedAt to use time zones
        await queryInterface.changeColumn('FoodSynonyms', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
        await queryInterface.changeColumn('FoodSynonyms', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column renaming back to original names
        await queryInterface.renameColumn('FoodSynonyms', 'foodName', 'food_name');
        await queryInterface.renameColumn('FoodSynonyms', 'standardizedName', 'standardized_name');

        // Revert createdAt and updatedAt columns to their original types
        await queryInterface.changeColumn('FoodSynonyms', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.changeColumn('FoodSynonyms', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false
        });

        // Rename table back to 'food_synonyms'
        await queryInterface.renameTable('FoodSynonyms', 'food_synonyms');
    }
};

