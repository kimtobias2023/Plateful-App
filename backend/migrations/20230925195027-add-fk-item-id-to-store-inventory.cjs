'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addConstraint('store_inventory', {
            fields: ['item_id'],
            type: 'foreign key',
            name: 'fk_item_id',
            references: {
                table: 'grocery_items',
                field: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('store_inventory', 'fk_item_id');
    }
};
