'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'mongooseId', {
            type: Sequelize.STRING(255),
            allowNull: true,
            unique: true,
            defaultValue: null,
            comment: 'MongoDB unique identifier for the user'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'mongooseId');
    }
};


