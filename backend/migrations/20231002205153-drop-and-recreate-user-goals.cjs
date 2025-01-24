'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Drop the current table
        await queryInterface.dropTable('user_goals');

        // Recreate the table with the desired schema
        return queryInterface.createTable('user_goals', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id'
                },
                allowNull: false
            },
            goal_type: {
                type: Sequelize.ENUM('health', 'budget', 'time', 'quality_of_life'),
                allowNull: false
            },
            target_value: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: false
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
        return queryInterface.dropTable('user_goals');
    }
};

