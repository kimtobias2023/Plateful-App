'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('purchase_history', 'createdAt', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        });

        await queryInterface.addColumn('purchase_history', 'updatedAt', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('purchase_history', 'createdAt');
        await queryInterface.removeColumn('purchase_history', 'updatedAt');
    }
};
