'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add first name and last name
        await queryInterface.addColumn('users', 'first_name', {
            type: Sequelize.STRING(255),
            allowNull: true
        });
        await queryInterface.addColumn('users', 'last_name', {
            type: Sequelize.STRING(255),
            allowNull: true
        });

        // Add address
        await queryInterface.addColumn('users', 'address', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        // Add birthday
        await queryInterface.addColumn('users', 'birthday', {
            type: Sequelize.DATE,
            allowNull: true
        });

        // Add gender (You can expand upon this as needed, e.g., adding other options or using ENUMs)
        await queryInterface.addColumn('users', 'gender', {
            type: Sequelize.STRING(50),
            allowNull: true
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'first_name');
        await queryInterface.removeColumn('users', 'last_name');
        await queryInterface.removeColumn('users', 'address');
        await queryInterface.removeColumn('users', 'birthday');
        await queryInterface.removeColumn('users', 'gender');
    }
};

