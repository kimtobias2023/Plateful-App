'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename the table to 'FoodNutrients'
        await queryInterface.renameTable('food_nutrients', 'FoodNutrients');

        // Rename columns to camelCase
        await queryInterface.renameColumn('FoodNutrients', 'food_reference_id', 'foodReferenceId');
        await queryInterface.renameColumn('FoodNutrients', 'nutrient_name', 'nutrientName');
        await queryInterface.renameColumn('FoodNutrients', 'value', 'nutrientValue');
        await queryInterface.renameColumn('FoodNutrients', 'conversion_factor', 'conversionFactor');
        await queryInterface.renameColumn('FoodNutrients', 'created_at', 'createdAt');
        await queryInterface.renameColumn('FoodNutrients', 'updated_at', 'updatedAt');

        // Update createdAt and updatedAt to use time zones
        await queryInterface.changeColumn('FoodNutrients', 'createdAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
        await queryInterface.changeColumn('FoodNutrients', 'updatedAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column renaming back to original names
        await queryInterface.renameColumn('FoodNutrients', 'foodReferenceId', 'food_reference_id');
        await queryInterface.renameColumn('FoodNutrients', 'nutrientName', 'nutrient_name');
        await queryInterface.renameColumn('FoodNutrients', 'nutrientValue', 'value');
        await queryInterface.renameColumn('FoodNutrients', 'conversionFactor', 'conversion_factor');
        await queryInterface.renameColumn('FoodNutrients', 'createdAt', 'created_at');
        await queryInterface.renameColumn('FoodNutrients', 'updatedAt', 'updated_at');

        // Revert createdAt and updatedAt columns to their original types
        await queryInterface.changeColumn('FoodNutrients', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.changeColumn('FoodNutrients', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false
        });

        // Rename table back to 'food_nutrients'
        await queryInterface.renameTable('FoodNutrients', 'food_nutrients');
    }
};

