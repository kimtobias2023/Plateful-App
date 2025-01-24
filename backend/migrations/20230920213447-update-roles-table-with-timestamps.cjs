'use strict';

// migrations/[timestamp]-add-timestamps-to-roles.js

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('roles', 'created_at', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()')
        });
        await queryInterface.addColumn('roles', 'updated_at', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()')
        });
        // Comment
        await queryInterface.sequelize.query(`COMMENT ON COLUMN roles.created_at IS 'Timestamp when the record was created.';`);
        await queryInterface.sequelize.query(`COMMENT ON COLUMN roles.updated_at IS 'Timestamp when the record was last updated.';`);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('roles', 'created_at');
        await queryInterface.removeColumn('roles', 'updated_at');
    }
};

