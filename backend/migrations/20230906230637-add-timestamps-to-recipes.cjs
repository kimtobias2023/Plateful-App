'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('recipes', 'createdAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        }).then(() => {
            return queryInterface.addColumn('recipes', 'updatedAt', {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            });
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('recipes', 'createdAt').then(() => {
            return queryInterface.removeColumn('recipes', 'updatedAt');
        });
    },
};
