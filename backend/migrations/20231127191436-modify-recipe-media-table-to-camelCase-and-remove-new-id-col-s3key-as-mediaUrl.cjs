'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table to RecipeMedias
        await queryInterface.renameTable('recipe_media', 'RecipeMedias');

        // Rename columns to camelCase
        await queryInterface.renameColumn('RecipeMedias', 'media_type', 'mediaType');
        await queryInterface.renameColumn('RecipeMedias', 'recipe_id', 'recipeId');
        await queryInterface.renameColumn('RecipeMedias', 'media_url', 's3Key');
        await queryInterface.renameColumn('RecipeMedias', 'created_at', 'createdAt');
        await queryInterface.renameColumn('RecipeMedias', 'updated_at', 'updatedAt');

        // Remove the new_id column
        await queryInterface.removeColumn('RecipeMedias', 'new_id');

        // Update createdAt and updatedAt to use time zones
        await queryInterface.changeColumn('RecipeMedias', 'createdAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
        await queryInterface.changeColumn('RecipeMedias', 'updatedAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert changes
        await queryInterface.renameTable('RecipeMedias', 'recipe_media');
        await queryInterface.renameColumn('recipe_media', 'mediaType', 'media_type');
        await queryInterface.renameColumn('recipe_media', 'recipeId', 'recipe_id');
        await queryInterface.renameColumn('recipe_media', 's3Key', 'media_url');
        await queryInterface.renameColumn('recipe_media', 'createdAt', 'created_at');
        await queryInterface.renameColumn('recipe_media', 'updatedAt', 'updated_at');

        // Re-add the new_id column
        await queryInterface.addColumn('recipe_media', 'new_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: Sequelize.literal('nextval(\'recipe_media_new_id_seq\'::regclass)')
        });

        // Revert createdAt and updatedAt columns to their original types
        await queryInterface.changeColumn('recipe_media', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.changeColumn('recipe_media', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
    }
};
