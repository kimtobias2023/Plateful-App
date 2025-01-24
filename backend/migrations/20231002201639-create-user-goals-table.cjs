'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('UserGoals', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            goalType: {
                type: Sequelize.ENUM('Health', 'Financial', 'Other'),
                allowNull: false
            },
            goalDescription: {
                type: Sequelize.STRING,
                allowNull: false
            },
            targetValue: {
                type: Sequelize.FLOAT
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            endDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('UserGoals');
    }
};

