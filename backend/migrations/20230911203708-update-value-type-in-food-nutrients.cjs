'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('food_nutrients', 'value', {
            type: Sequelize.FLOAT,
            allowNull: false,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('food_nutrients', 'value', {
            type: Sequelize.STRING,
            allowNull: false,
        });
    },
};

