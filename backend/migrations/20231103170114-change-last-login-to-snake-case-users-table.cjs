'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('users', 'last_login', {
            type: Sequelize.DATE,
            allowNull: true,
            after: 'updated_at', // adjust the position as needed
            comment: 'Timestamp for the user\'s last successful login'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('users', 'last_login');
    }
};
