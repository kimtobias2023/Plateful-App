'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_goal_progress', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            user_goal_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'user_goals',
                    key: 'id'
                }
            },
            goal_type: {
                type: Sequelize.ENUM('budget', 'health', 'time_saving', 'meal_satisfaction'),
                allowNull: false
            },
            metric_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            current_value: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            duration: {
                type: Sequelize.ENUM('weekly', 'monthly'),
                allowNull: false
            },
            progress_date: {
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
        await queryInterface.dropTable('user_goal_progress');
    }
};

