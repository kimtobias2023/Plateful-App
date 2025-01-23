'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename columns to camelCase
        await queryInterface.renameColumn('Labels', 'label_name', 'labelName');
        await queryInterface.renameColumn('Labels', 'label_type', 'labelType');

        // Update createdAt and updatedAt to use time zones
        await queryInterface.changeColumn('Labels', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
        await queryInterface.changeColumn('Labels', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column renaming back to original names
        await queryInterface.renameColumn('Labels', 'labelName', 'label_name');
        await queryInterface.renameColumn('Labels', 'labelType', 'label_type');

        // Revert createdAt and updatedAt columns to their original types
        await queryInterface.changeColumn('Labels', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.changeColumn('Labels', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
    }
};

