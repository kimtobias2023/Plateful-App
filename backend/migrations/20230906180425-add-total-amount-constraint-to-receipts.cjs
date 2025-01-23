'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addConstraint('receipts', {
            fields: ['total_amount'],
            type: 'check',
            where: {
                total_amount: {
                    [Sequelize.Op.gte]: 0,  // Greater than or equal to 0
                },
            },
            name: 'total_amount_positive_check',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('receipts', 'total_amount_positive_check');
    },
};
