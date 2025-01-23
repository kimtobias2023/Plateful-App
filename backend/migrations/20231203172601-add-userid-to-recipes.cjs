'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Recipes', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: true, // Set to false if it's a required field
            references: {
                model: 'Users', // Name of the Users table
                key: 'id', // Key in Users that Recipes will reference
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL', // Or 'CASCADE' if you want to delete recipes when a user is deleted
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Recipes', 'userId');
    },
};
