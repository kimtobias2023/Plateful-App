'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            'receipts',  // name of the table
            'total_amount',  // name of the column
            {
                type: Sequelize.FLOAT,
                allowNull: false,
                comment: 'Total amount for the receipt',
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('receipts', 'total_amount');
    }
};

