'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('user_media', 'media_label', {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'Descriptive label for the media type (e.g., profile_img, carousel_img)'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('user_media', 'media_label');
    }
};
