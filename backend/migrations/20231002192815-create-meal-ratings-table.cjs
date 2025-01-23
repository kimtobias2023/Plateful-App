'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('meal_ratings', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
            },
            meal_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "ID of the meal, either home-cooked or restaurant",
            },
            meal_type: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: "Type of meal, 'home' or 'restaurant'",
            },
            time_rating: {
                type: Sequelize.FLOAT,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5
                },
                comment: "Time efficiency rating. Null indicates unrated.",
            },
            cost_rating: {
                type: Sequelize.FLOAT,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5
                },
                comment: "Cost efficiency rating. Null indicates unrated.",
            },
            difficulty_rating: {
                type: Sequelize.FLOAT,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5
                },
                comment: "Difficulty level rating. Null indicates unrated.",
            },
            health_rating: {
                type: Sequelize.FLOAT,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5
                },
                comment: "Healthiness rating. Null indicates unrated.",
            },
            taste_rating: {
                type: Sequelize.FLOAT,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5
                },
                comment: "Taste rating. Null indicates unrated.",
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('meal_ratings');
    }
};

