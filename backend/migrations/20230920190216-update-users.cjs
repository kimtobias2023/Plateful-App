'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('users', 'password', {
            type: Sequelize.STRING(512),
            allowNull: false
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('users', 'password', {
            type: Sequelize.STRING(255),
            allowNull: false
        });
    },
};
