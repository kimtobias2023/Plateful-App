'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('grocery_list_items', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Date and time when the grocery list item was created'
        });

        await queryInterface.addColumn('grocery_list_items', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Date and time when the grocery list item was last updated'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('grocery_list_items', 'created_at');
        await queryInterface.removeColumn('grocery_list_items', 'updated_at');
    }
};

