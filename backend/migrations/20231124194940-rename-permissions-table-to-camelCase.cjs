'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table to Permissions
        await queryInterface.renameTable('permissions', 'Permissions');

        // Rename columns to camelCase
        await queryInterface.renameColumn('Permissions', 'created_at', 'createdAt');
        await queryInterface.renameColumn('Permissions', 'updated_at', 'updatedAt');
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column names to snake_case
        await queryInterface.renameColumn('Permissions', 'createdAt', 'created_at');
        await queryInterface.renameColumn('Permissions', 'updatedAt', 'updated_at');

        // Rename table back to permissions
        await queryInterface.renameTable('Permissions', 'permissions');
    }
};

