'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('recipe_labels', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
            comment: 'Timestamp when the recipe-label association was created'
        });

        await queryInterface.addColumn('recipe_labels', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Timestamp of the last update to the recipe-label association'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('recipe_labels', 'created_at');
        await queryInterface.removeColumn('recipe_labels', 'updated_at');
    }
};

