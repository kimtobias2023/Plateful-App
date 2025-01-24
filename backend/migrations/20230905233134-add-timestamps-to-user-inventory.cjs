'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('user_inventory', 'createdAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: new Date()
        });

        await queryInterface.addColumn('user_inventory', 'updatedAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: new Date()
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('user_inventory', 'createdAt');
        await queryInterface.removeColumn('user_inventory', 'updatedAt');
    }
};

