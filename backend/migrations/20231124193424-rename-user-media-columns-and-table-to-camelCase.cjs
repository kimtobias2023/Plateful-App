'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table to UserMedia
        await queryInterface.renameTable('user_media', 'UserMedia');

        // Rename columns to camelCase
        await queryInterface.renameColumn('UserMedia', 'media_type', 'mediaType');
        await queryInterface.renameColumn('UserMedia', 'user_id', 'userId');
        await queryInterface.renameColumn('UserMedia', 'media_url', 'mediaUrl');
        await queryInterface.renameColumn('UserMedia', 'created_at', 'createdAt');
        await queryInterface.renameColumn('UserMedia', 'updated_at', 'updatedAt');
        await queryInterface.renameColumn('UserMedia', 's3_key', 's3Key');
        await queryInterface.renameColumn('UserMedia', 'media_label', 'mediaLabel');
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column names to snake_case
        await queryInterface.renameColumn('UserMedia', 'mediaType', 'media_type');
        await queryInterface.renameColumn('UserMedia', 'userId', 'user_id');
        await queryInterface.renameColumn('UserMedia', 'mediaUrl', 'media_url');
        await queryInterface.renameColumn('UserMedia', 'createdAt', 'created_at');
        await queryInterface.renameColumn('UserMedia', 'updatedAt', 'updated_at');
        await queryInterface.renameColumn('UserMedia', 's3Key', 's3_key');
        await queryInterface.renameColumn('UserMedia', 'mediaLabel', 'media_label');

        // Rename table back to user_media
        await queryInterface.renameTable('UserMedia', 'user_media');
    }
};

