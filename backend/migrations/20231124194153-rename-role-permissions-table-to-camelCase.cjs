'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table to RolePermissions
        await queryInterface.renameTable('role_permissions', 'RolePermissions');

        // Rename columns to camelCase
        await queryInterface.renameColumn('RolePermissions', 'role_id', 'roleId');
        await queryInterface.renameColumn('RolePermissions', 'permission_id', 'permissionId');
        await queryInterface.renameColumn('RolePermissions', 'created_at', 'createdAt');
        await queryInterface.renameColumn('RolePermissions', 'updated_at', 'updatedAt');
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column names to snake_case
        await queryInterface.renameColumn('RolePermissions', 'roleId', 'role_id');
        await queryInterface.renameColumn('RolePermissions', 'permissionId', 'permission_id');
        await queryInterface.renameColumn('RolePermissions', 'createdAt', 'created_at');
        await queryInterface.renameColumn('RolePermissions', 'updatedAt', 'updated_at');

        // Rename table back to role_permissions
        await queryInterface.renameTable('RolePermissions', 'role_permissions');
    }
};
