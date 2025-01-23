'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Explicitly define the ENUM type first
        await queryInterface.sequelize.query(`CREATE TYPE "enum_receipts_type" AS ENUM('Grocery', 'Dining Out');`);

        // Then add the column
        await queryInterface.addColumn('receipts', 'type', {
            type: 'enum_receipts_type',
            allowNull: false,
            comment: "Type of the receipt (e.g., 'Grocery' or 'Dining Out')"
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the column first
        await queryInterface.removeColumn('receipts', 'type');

        // Then drop the ENUM type
        await queryInterface.sequelize.query('DROP TYPE "enum_receipts_type";');
    }
};


