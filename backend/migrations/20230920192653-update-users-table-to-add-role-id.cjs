'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'role_id', {
            type: Sequelize.INTEGER,
            references: {
                model: 'roles',
                key: 'id'
            },
            allowNull: true,
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'role_id');
    }
};
