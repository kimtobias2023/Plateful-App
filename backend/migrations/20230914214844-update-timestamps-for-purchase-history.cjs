'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('purchase_history', 'createdAt', 'created_at');
        await queryInterface.renameColumn('purchase_history', 'updatedAt', 'updated_at');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('purchase_history', 'created_at', 'createdAt');
        await queryInterface.renameColumn('purchase_history', 'updated_at', 'updatedAt');
    }
};

