'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('user_inventory', 'createdAt', 'created_at');
        await queryInterface.renameColumn('user_inventory', 'updatedAt', 'updated_at');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('user_inventory', 'created_at', 'createdAt');
        await queryInterface.renameColumn('user_inventory', 'updated_at', 'updatedAt');
    }
};

