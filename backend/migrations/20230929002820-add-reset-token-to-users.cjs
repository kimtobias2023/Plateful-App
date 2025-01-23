'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'resetToken', {
            type: Sequelize.STRING(512),
            allowNull: true,
            comment: 'Token for password reset'
        });

        await queryInterface.addColumn('users', 'resetTokenExpiresAt', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Expiration date for the password reset token'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'resetToken');
        await queryInterface.removeColumn('users', 'resetTokenExpiresAt');
    }
};
