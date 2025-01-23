'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Remove resetToken column
        await queryInterface.removeColumn('users', 'resetToken');

        // Remove resetTokenExpiresAt column
        await queryInterface.removeColumn('users', 'resetTokenExpiresAt');
    },

    down: async (queryInterface, Sequelize) => {
        // Add back resetToken column
        await queryInterface.addColumn('users', 'resetToken', {
            type: Sequelize.STRING,
            allowNull: true
        });

        // Add back resetTokenExpiresAt column
        await queryInterface.addColumn('users', 'resetTokenExpiresAt', {
            type: Sequelize.DATE,
            allowNull: true
        });
    }
};

