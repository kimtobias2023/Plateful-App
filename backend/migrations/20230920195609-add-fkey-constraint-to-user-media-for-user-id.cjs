'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add foreign key constraint to user_media for user_id
        await queryInterface.addConstraint('user_media', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'user_media_user_id_fkey',
            references: {
                table: 'users',
                field: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        });

        // Comment describing the change
        await queryInterface.sequelize.query(
            `COMMENT ON CONSTRAINT user_media_user_id_fkey ON user_media IS 'Foreign key constraint linking user_id in user_media to id in users.';`
        );
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the foreign key constraint in the event of a rollback
        await queryInterface.removeConstraint('user_media', 'user_media_user_id_fkey');
    }
};

