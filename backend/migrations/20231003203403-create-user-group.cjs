'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_groups', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                comment: 'Unique identifier for the user group',
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Name of the user group',
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'Description or purpose of the user group',
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Use snake_case for the referenced model name
                    key: 'id',
                },
                comment: 'User who created the group',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: 'Date when the group was created',
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: 'Date when the group was last updated',
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('user_groups');
    },
};


