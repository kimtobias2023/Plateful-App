'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('meal_histories', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            mealId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            mealType: {
                type: Sequelize.ENUM('Recipe', 'RestaurantMeal'),
                allowNull: false
            },
            dateConsumed: {
                type: Sequelize.DATE,
                allowNull: false
            },
            portions: {
                type: Sequelize.FLOAT,
                defaultValue: 1
            },
            notes: {
                type: Sequelize.TEXT
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
        await queryInterface.dropTable('meal_histories');
    }
};

