'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('grocery_lists', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Date and time when the grocery list was created'
        });

        await queryInterface.addColumn('grocery_lists', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Date and time when the grocery list was last updated'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('grocery_lists', 'created_at');
        await queryInterface.removeColumn('grocery_lists', 'updated_at');
    }
};

