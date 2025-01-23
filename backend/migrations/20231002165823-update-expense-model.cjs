'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add expense_type column
        await queryInterface.addColumn('expenses', 'expense_type', {
            type: Sequelize.ENUM('Grocery', 'Dining Out', 'Snacks', 'Delivery', 'Others'),
            allowNull: false,
            comment: "Type of the food-related expense"
        });

        // Add related_receipt_id column
        await queryInterface.addColumn('expenses', 'related_receipt_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'receipts',
                key: 'id'
            },
            comment: "Identifier of the related receipt if applicable"
        });

        // If you want to handle scenarios where the database is not empty, 
        // you may want to set default values or map existing rows to a specific type.
    },

    down: async (queryInterface, Sequelize) => {
        // This will remove the newly added columns in a rollback scenario

        await queryInterface.removeColumn('expenses', 'expense_type');
        await queryInterface.removeColumn('expenses', 'related_receipt_id');
    }
};

