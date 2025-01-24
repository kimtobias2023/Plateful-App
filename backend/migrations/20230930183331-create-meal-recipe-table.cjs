'use strict';

// migrations/<timestamp>-create-meal-recipe.js

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('meal_recipes', {
            mealplan_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'meal_plans',
                    key: 'id'
                },
                primaryKey: true,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            mealtype_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'meal_types',
                    key: 'id'
                },
                primaryKey: true,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            recipe_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'recipes',
                    key: 'id'
                },
                primaryKey: true,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('meal_recipes');
    }
};

