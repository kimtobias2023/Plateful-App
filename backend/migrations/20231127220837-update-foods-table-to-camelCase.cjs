'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename the table to 'Foods'
        await queryInterface.renameTable('foods', 'Foods');

        // Rename columns to camelCase
        await queryInterface.renameColumn('Foods', 'food_name', 'foodName');
        await queryInterface.renameColumn('Foods', 'standardized_name', 'standardizedName');
        await queryInterface.renameColumn('Foods', 'fdc_id', 'fdcId');
        await queryInterface.renameColumn('Foods', 'serving_size', 'servingSize');
        await queryInterface.renameColumn('Foods', 'serving_unit', 'servingUnit');

        // Update createdAt and updatedAt to use time zones
        await queryInterface.changeColumn('Foods', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
        await queryInterface.changeColumn('Foods', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column renaming back to original names
        await queryInterface.renameColumn('Foods', 'foodName', 'food_name');
        await queryInterface.renameColumn('Foods', 'standardizedName', 'standardized_name');
        await queryInterface.renameColumn('Foods', 'fdcId', 'fdc_id');
        await queryInterface.renameColumn('Foods', 'servingSize', 'serving_size');
        await queryInterface.renameColumn('Foods', 'servingUnit', 'serving_unit');

        // Revert createdAt and updatedAt columns to their original types
        await queryInterface.changeColumn('Foods', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.changeColumn('Foods', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false
        });

        // Rename table back to 'foods'
        await queryInterface.renameTable('Foods', 'foods');
    }
};

