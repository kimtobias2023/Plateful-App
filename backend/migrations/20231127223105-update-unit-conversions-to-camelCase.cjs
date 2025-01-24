'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename the table to 'UnitConversions'
        await queryInterface.renameTable('unit_conversions', 'UnitConversions');

        // Rename columns to camelCase
        await queryInterface.renameColumn('UnitConversions', 'from_unit', 'fromUnit');
        await queryInterface.renameColumn('UnitConversions', 'to_unit', 'toUnit');
        await queryInterface.renameColumn('UnitConversions', 'conversion_factor', 'conversionFactor');
        await queryInterface.renameColumn('UnitConversions', 'created_at', 'createdAt');
        await queryInterface.renameColumn('UnitConversions', 'updated_at', 'updatedAt');

        // Update createdAt and updatedAt to use time zones
        await queryInterface.changeColumn('UnitConversions', 'createdAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
        await queryInterface.changeColumn('UnitConversions', 'updatedAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column renaming back to original names
        await queryInterface.renameColumn('UnitConversions', 'fromUnit', 'from_unit');
        await queryInterface.renameColumn('UnitConversions', 'toUnit', 'to_unit');
        await queryInterface.renameColumn('UnitConversions', 'conversionFactor', 'conversion_factor');
        await queryInterface.renameColumn('UnitConversions', 'createdAt', 'created_at');
        await queryInterface.renameColumn('UnitConversions', 'updatedAt', 'updated_at');

        // Revert createdAt and updatedAt columns to their original types
        await queryInterface.changeColumn('UnitConversions', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.changeColumn('UnitConversions', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false
        });

        // Rename table back to 'unit_conversions'
        await queryInterface.renameTable('UnitConversions', 'unit_conversions');
    }
};

