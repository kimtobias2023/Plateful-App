'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('roles', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()')
        });
        await queryInterface.changeColumn('roles', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()')
        });
    },

    down: async (queryInterface, Sequelize) => {
        // If you need to revert the changes
        // Note: You may not want to revert these changes, 
        // but you can set the columns back to their original state if necessary.
    }
};

