'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('reset_tokens', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
                comment: 'Unique identifier for each record in the table' // Added comment
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id'
                },
                allowNull: false,
                unique: true,
                comment: 'Foreign key referencing the associated user' // Added comment
            },
            token: {
                type: Sequelize.STRING(512),
                allowNull: false,
                comment: 'JWT token used for password reset verification' // Added comment
            },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: 'Timestamp indicating when the reset token expires' // Added comment
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                comment: 'Timestamp indicating when the record was created' // Added comment
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                comment: 'Timestamp indicating the last time the record was updated' // Added comment
            }
        }, {
            comment: 'Table to store reset tokens for user password recovery' // Added table-level comment
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('reset_tokens');
    }
};

