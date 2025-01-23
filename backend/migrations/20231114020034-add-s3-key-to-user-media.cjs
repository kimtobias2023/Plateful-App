'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add the s3Key column to the user_media table
        await queryInterface.addColumn('user_media', 's3_key', {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'AWS S3 key for the user media file'
        });
    },

    async down(queryInterface, Sequelize) {
        // Remove the s3Key column from the user_media table
        await queryInterface.removeColumn('user_media', 's3_key');
    }
};
