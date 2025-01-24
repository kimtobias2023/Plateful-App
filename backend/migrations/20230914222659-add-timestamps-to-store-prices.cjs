'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('store_prices', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });
        await queryInterface.addColumn('store_prices', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('store_prices', 'created_at');
        await queryInterface.removeColumn('store_prices', 'updated_at');
    }
};

