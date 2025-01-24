'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table to Roles
        await queryInterface.renameTable('roles', 'Roles');

        // Rename columns to camelCase
        await queryInterface.renameColumn('Roles', 'created_at', 'createdAt');
        await queryInterface.renameColumn('Roles', 'updated_at', 'updatedAt');
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column names to snake_case
        await queryInterface.renameColumn('Roles', 'createdAt', 'created_at');
        await queryInterface.renameColumn('Roles', 'updatedAt', 'updated_at');

        // Rename table back to roles
        await queryInterface.renameTable('Roles', 'roles');
    }
};
