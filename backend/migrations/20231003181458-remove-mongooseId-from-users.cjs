'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'mongooseId');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'mongooseId', {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            comment: 'ID reference to Mongoose Users model'
        });
    }
};

