'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            'user_media',
            'created_at',
            {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        );

        await queryInterface.addColumn(
            'user_media',
            'updated_at',
            {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn(
            'user_media',
            'created_at'
        );

        await queryInterface.removeColumn(
            'user_media',
            'updated_at'
        );
    }
};

