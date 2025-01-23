'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Drop the current table
        await queryInterface.dropTable('notifications');

        // Recreate the table with the desired schema
        return queryInterface.createTable('notifications', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            read: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                allowNull: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable('notifications');
    }
};

