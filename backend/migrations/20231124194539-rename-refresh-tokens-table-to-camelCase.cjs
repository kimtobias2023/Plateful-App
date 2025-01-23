'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table to RefreshTokens
        await queryInterface.renameTable('refresh_tokens', 'RefreshTokens');

        // Rename columns to camelCase
        await queryInterface.renameColumn('RefreshTokens', 'user_id', 'userId');
        await queryInterface.renameColumn('RefreshTokens', 'expires_at', 'expiresAt');
        await queryInterface.renameColumn('RefreshTokens', 'created_at', 'createdAt');
        await queryInterface.renameColumn('RefreshTokens', 'updated_at', 'updatedAt');
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column names to snake_case
        await queryInterface.renameColumn('RefreshTokens', 'userId', 'user_id');
        await queryInterface.renameColumn('RefreshTokens', 'expiresAt', 'expires_at');
        await queryInterface.renameColumn('RefreshTokens', 'createdAt', 'created_at');
        await queryInterface.renameColumn('RefreshTokens', 'updatedAt', 'updated_at');

        // Rename table back to refresh_tokens
        await queryInterface.renameTable('RefreshTokens', 'refresh_tokens');
    }
};

