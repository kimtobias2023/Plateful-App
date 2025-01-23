'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addConstraint('recipe_ratings_reviews', {
            fields: ['recipe_id'],
            type: 'foreign key',
            name: 'fk_recipe',
            references: {
                table: 'recipes',
                field: 'id'
            },
            onDelete: 'cascade'
        });

        await queryInterface.addConstraint('recipe_ratings_reviews', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'fk_user',
            references: {
                table: 'Users',
                field: 'id'
            },
            onDelete: 'cascade'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('recipe_ratings_reviews', 'fk_recipe');
        await queryInterface.removeConstraint('recipe_ratings_reviews', 'fk_user');
    }
};

