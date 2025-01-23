'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('store_inventory', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });
        await queryInterface.addColumn('store_inventory', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('store_inventory', 'created_at');
        await queryInterface.removeColumn('store_inventory', 'updated_at');
    }
};

