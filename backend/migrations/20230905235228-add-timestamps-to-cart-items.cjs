'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('cart_items', 'createdAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: new Date()
        });
        await queryInterface.addColumn('cart_items', 'updatedAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: new Date()
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('cart_items', 'createdAt');
        await queryInterface.removeColumn('cart_items', 'updatedAt');
    }
};

