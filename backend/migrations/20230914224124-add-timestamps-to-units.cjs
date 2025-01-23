'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('units', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });
        await queryInterface.addColumn('units', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('units', 'created_at');
        await queryInterface.removeColumn('units', 'updated_at');
    }
};

