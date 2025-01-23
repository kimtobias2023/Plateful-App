'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('financial_summary', 'total_income');  // Remove the total_income column
        await queryInterface.removeColumn('financial_summary', 'total_expense'); // Remove the total_expense column

        // Add the new columns for total_grocery_expense, total_eating_out_expense, and budget_for_the_month
        await queryInterface.addColumn('financial_summary', 'total_grocery_expense', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            comment: "Total spent on groceries"
        });

        await queryInterface.addColumn('financial_summary', 'total_eating_out_expense', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            comment: "Total spent on eating out, including delivered meals"
        });

        await queryInterface.addColumn('financial_summary', 'budget_for_the_month', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,  // Making this optional if users don't set a budget
            comment: "User-set budget for food for the month"
        });
    },

    down: async (queryInterface, Sequelize) => {
        // For reverting the migration: remove the newly added columns and re-add the old columns
        await queryInterface.removeColumn('financial_summary', 'total_grocery_expense');
        await queryInterface.removeColumn('financial_summary', 'total_eating_out_expense');
        await queryInterface.removeColumn('financial_summary', 'budget_for_the_month');

        await queryInterface.addColumn('financial_summary', 'total_income', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            comment: "Total income for the user for the given month"
        });

        await queryInterface.addColumn('financial_summary', 'total_expense', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            comment: "Total expense for the user for the given month"
        });
    }
};
