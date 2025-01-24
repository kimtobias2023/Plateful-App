'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('unit_conversions', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });
        await queryInterface.addColumn('unit_conversions', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('unit_conversions', 'created_at');
        await queryInterface.removeColumn('unit_conversions', 'updated_at');
    }
};

