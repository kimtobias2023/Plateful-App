// migrations/add-timestamps-to-food-synonyms.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('food_synonyms', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Time when the record was created'
        });

        await queryInterface.addColumn('food_synonyms', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            comment: 'Time when the record was last updated'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('food_synonyms', 'created_at');
        await queryInterface.removeColumn('food_synonyms', 'updated_at');
    }
};

