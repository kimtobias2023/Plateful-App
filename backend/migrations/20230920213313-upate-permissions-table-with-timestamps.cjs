'use strict';

// migrations/[timestamp]-add-timestamps-to-permissions.js

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('permissions', 'created_at', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()')
        });
        await queryInterface.addColumn('permissions', 'updated_at', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()')
        });
        // Comment
        await queryInterface.sequelize.query(`COMMENT ON COLUMN permissions.created_at IS 'Timestamp when the record was created.';`);
        await queryInterface.sequelize.query(`COMMENT ON COLUMN permissions.updated_at IS 'Timestamp when the record was last updated.';`);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('permissions', 'created_at');
        await queryInterface.removeColumn('permissions', 'updated_at');
    }
};

