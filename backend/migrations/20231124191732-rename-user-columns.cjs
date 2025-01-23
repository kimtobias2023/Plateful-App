'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('users', 'role_id', 'roleId');
        await queryInterface.renameColumn('users', 'created_at', 'createdAt');
        await queryInterface.renameColumn('users', 'updated_at', 'updatedAt');
        await queryInterface.renameColumn('users', 'last_login', 'lastLogin');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('users', 'role_id', 'roleId');
        await queryInterface.renameColumn('users', 'created_at', 'createdAt');
        await queryInterface.renameColumn('users', 'updated_at', 'updatedAt');
        await queryInterface.renameColumn('users', 'last_login', 'lastLogin');
    }
};
