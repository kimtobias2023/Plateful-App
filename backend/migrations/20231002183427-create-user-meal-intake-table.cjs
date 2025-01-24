'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_meal_intakes', {
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
                },
                onDelete: 'CASCADE',
                comment: 'Foreign key reference to users table'
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
                comment: 'The date of the meal intake'
            },
            meal_type: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Type of the meal (e.g., breakfast, lunch, dinner, snack)'
            },
            calories: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: 'Caloric content of the meal'
            },
            protein: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: 'Protein content of the meal'
            },
            carbs: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: 'Carbohydrate content of the meal'
            },
            fats: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: 'Fat content of the meal'
            },
            sugar: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: 'Sugar content of the meal'
            },
            sodium: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: 'Sodium content of the meal'
            },
            fiber: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: 'Fiber content of the meal'
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
        await queryInterface.dropTable('user_meal_intakes');
    }
};
