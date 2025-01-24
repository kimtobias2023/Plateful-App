'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Drop existing table if it exists
        await queryInterface.dropTable('user_health_metrics', { cascade: true });

        // Create the table
        await queryInterface.createTable('user_health_metrics', {
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
                }
            },
            weight: Sequelize.FLOAT,
            height: Sequelize.FLOAT,
            body_fat_percentage: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            bmi: Sequelize.FLOAT,
            caloric_intake: Sequelize.FLOAT,
            activity_level: {
                type: Sequelize.ENUM('sedentary', 'light', 'moderate', 'active', 'very active'),
                allowNull: true
            },
            target_weight: Sequelize.FLOAT,
            measurement_date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
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
        await queryInterface.dropTable('user_health_metrics', { cascade: true });
    }
};

