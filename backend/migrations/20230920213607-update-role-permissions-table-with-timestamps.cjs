'use strict';

// migrations/[timestamp]-add-timestamps-to-role_permissions.js

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('role_permissions', 'created_at', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()')
        });
        await queryInterface.addColumn('role_permissions', 'updated_at', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()')
        });
        // Comment
        await queryInterface.sequelize.query(`COMMENT ON COLUMN role_permissions.created_at IS 'Timestamp when the record was created.';`);
        await queryInterface.sequelize.query(`COMMENT ON COLUMN role_permissions.updated_at IS 'Timestamp when the record was last updated.';`);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('role_permissions', 'created_at');
        await queryInterface.removeColumn('role_permissions', 'updated_at');
    }
};

