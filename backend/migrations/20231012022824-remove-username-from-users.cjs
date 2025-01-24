'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'username');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'username', {
            type: Sequelize.STRING,
            allowNull: true,  // Or false, based on your requirements
            unique: true
        });
    }
};

