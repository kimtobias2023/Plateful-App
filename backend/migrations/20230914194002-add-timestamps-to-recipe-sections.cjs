'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('recipe_sections', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Date and time when the record was created'
        });

        await queryInterface.addColumn('recipe_sections', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Date and time when the record was last updated'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('recipe_sections', 'created_at');
        await queryInterface.removeColumn('recipe_sections', 'updated_at');
    }
};

