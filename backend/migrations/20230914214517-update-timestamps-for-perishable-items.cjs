'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('perishable_items', 'createdAt', 'created_at');
        await queryInterface.renameColumn('perishable_items', 'updatedAt', 'updated_at');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('perishable_items', 'created_at', 'createdAt');
        await queryInterface.renameColumn('perishable_items', 'updated_at', 'updatedAt');
    }
};

