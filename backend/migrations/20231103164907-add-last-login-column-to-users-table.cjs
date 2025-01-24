'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('users', 'lastLoginDate', {
            type: Sequelize.DATE,
            allowNull: true
        });
        await queryInterface.addColumn('users', 'lastLoginTime', {
            type: Sequelize.TIME,
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('users', 'lastLoginDate');
        await queryInterface.removeColumn('users', 'lastLoginTime');
    }
};

