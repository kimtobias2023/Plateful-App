'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            'RecipeSectionIngredients', // name of the Source model
            'ingredientName', // name of the key to add
            {
                type: Sequelize.STRING,
                allowNull: true
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn(
            'RecipeSectionIngredients', // name of the Source model
            'ingredientName' // key to remove
        );
    }
};
