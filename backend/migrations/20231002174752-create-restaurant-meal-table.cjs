'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create 'restaurant_meals' table
        await queryInterface.createTable('restaurant_meals', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "Unique identifier for each restaurant meal record"
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                comment: "Identifier of the user who added the restaurant meal"
            },
            meal_name: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: "Name of the meal"
            },
            restaurant_name: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: "Name of the restaurant, if provided"
            },
            calories: {
                type: Sequelize.FLOAT,
                allowNull: false,
                comment: "Caloric content of the meal"
            },
            protein: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: "Protein content of the meal"
            },
            carbs: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: "Carbohydrate content of the meal"
            },
            fats: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: "Fat content of the meal"
            },
            sugar: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: "Sugar content of the meal"
            },
            sodium: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: "Sodium content of the meal"
            },
            fiber: {
                type: Sequelize.FLOAT,
                allowNull: true,
                comment: "Fiber content of the meal"
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
                comment: "Date and time when the record was created"
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
                comment: "Date and time when the record was last updated"
            },
        });

        // Add a comment to the table
        await queryInterface.sequelize.query('COMMENT ON TABLE "restaurant_meals" IS \'Table to store information about meals from restaurants with nutritional details.\'');
    },

    down: async (queryInterface, Sequelize) => {
        // Drop 'restaurant_meals' table
        await queryInterface.dropTable('restaurant_meals');
    }
};

