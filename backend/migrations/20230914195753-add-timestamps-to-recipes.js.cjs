'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('recipes', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Date and time when the record was created'
        });

        await queryInterface.addColumn('recipes', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Date and time when the record was last updated'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('recipes', 'created_at');
        await queryInterface.removeColumn('recipes', 'updated_at');
    }
};

