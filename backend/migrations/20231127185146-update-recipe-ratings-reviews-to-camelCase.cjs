'use strict';

'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table to RecipeRatingsReviews
        await queryInterface.renameTable('recipe_ratings_reviews', 'RecipeRatingsReviews');

        // Rename columns to camelCase
        await queryInterface.renameColumn('RecipeRatingsReviews', 'recipe_id', 'recipeId');
        await queryInterface.renameColumn('RecipeRatingsReviews', 'user_id', 'userId');
        await queryInterface.renameColumn('RecipeRatingsReviews', 'date', 'createdAt');

        // Update createdAt to use time zones and rename the constraint names
        await queryInterface.changeColumn('RecipeRatingsReviews', 'createdAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });

        // Update foreign key constraint for recipeId
        await queryInterface.removeConstraint('RecipeRatingsReviews', 'fk_recipe');
        await queryInterface.addConstraint('RecipeRatingsReviews', {
            type: 'foreign key',
            name: 'RecipeRatingsReviews_recipeId_fkey',
            fields: ['recipeId'],
            references: {
                table: 'Recipes',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION'
        });

        // Update foreign key constraint for userId
        await queryInterface.removeConstraint('RecipeRatingsReviews', 'fk_user');
        await queryInterface.addConstraint('RecipeRatingsReviews', {
            type: 'foreign key',
            name: 'RecipeRatingsReviews_userId_fkey',
            fields: ['userId'],
            references: {
                table: 'Users',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION'
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column renaming back to original names
        await queryInterface.renameColumn('RecipeRatingsReviews', 'recipeId', 'recipe_id');
        await queryInterface.renameColumn('RecipeRatingsReviews', 'userId', 'user_id');
        await queryInterface.renameColumn('RecipeRatingsReviews', 'createdAt', 'date');

        // Revert createdAt column to its original type
        await queryInterface.changeColumn('RecipeRatingsReviews', 'date', {
            type: Sequelize.DATE,
            allowNull: false
        });

        // Remove the updated foreign key constraints
        await queryInterface.removeConstraint('RecipeRatingsReviews', 'RecipeRatingsReviews_recipeId_fkey');
        await queryInterface.removeConstraint('RecipeRatingsReviews', 'RecipeRatingsReviews_userId_fkey');

        // Add back the original foreign key constraints
        await queryInterface.addConstraint('recipe_ratings_reviews', {
            type: 'foreign key',
            name: 'fk_recipe',
            fields: ['recipe_id'],
            references: {
                table: 'Recipes',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION'
        });
        await queryInterface.addConstraint('recipe_ratings_reviews', {
            type: 'foreign key',
            name: 'fk_user',
            fields: ['user_id'],
            references: {
                table: 'Users',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION'
        });

        // Rename table back to 'recipe_ratings_reviews'
        await queryInterface.renameTable('RecipeRatingsReviews', 'recipe_ratings_reviews');
    }
};
