'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_health_metrics', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id'
                },
                allowNull: false
            },
            weight: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            height: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            bodyFatPercentage: {
                type: Sequelize.FLOAT
            },
            bmi: {
                type: Sequelize.FLOAT
            },
            caloricIntake: {
                type: Sequelize.FLOAT
            },
            activityLevel: {
                type: Sequelize.ENUM('sedentary', 'light', 'moderate', 'active', 'very active')
            },
            targetWeight: {
                type: Sequelize.FLOAT
            },
            measurementDate: {
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

        // If you wish to add indexes (for optimization purposes)
        await queryInterface.addIndex('user_health_metrics', ['userId']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('user_health_metrics');
    }
};

