'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table to ResetTokens
        await queryInterface.renameTable('reset_tokens', 'ResetTokens');

        // Rename columns to camelCase
        await queryInterface.renameColumn('ResetTokens', 'user_id', 'userId');
        await queryInterface.renameColumn('ResetTokens', 'expires_at', 'expiresAt');
        await queryInterface.renameColumn('ResetTokens', 'created_at', 'createdAt');
        await queryInterface.renameColumn('ResetTokens', 'updated_at', 'updatedAt');
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column names to snake_case
        await queryInterface.renameColumn('ResetTokens', 'userId', 'user_id');
        await queryInterface.renameColumn('ResetTokens', 'expiresAt', 'expires_at');
        await queryInterface.renameColumn('ResetTokens', 'createdAt', 'created_at');
        await queryInterface.renameColumn('ResetTokens', 'updatedAt', 'updated_at');

        // Rename table back to reset_tokens
        await queryInterface.renameTable('ResetTokens', 'reset_tokens');
    }
};

