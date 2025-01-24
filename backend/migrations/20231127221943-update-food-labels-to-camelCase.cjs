'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename the table to 'FoodLabels'
        await queryInterface.renameTable('food_labels', 'FoodLabels');

        // Rename columns to camelCase
        await queryInterface.renameColumn('FoodLabels', 'label_id', 'labelId');
        await queryInterface.renameColumn('FoodLabels', 'created_at', 'createdAt');
        await queryInterface.renameColumn('FoodLabels', 'updated_at', 'updatedAt');

        // Update createdAt and updatedAt to use time zones
        await queryInterface.changeColumn('FoodLabels', 'createdAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
        await queryInterface.changeColumn('FoodLabels', 'updatedAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });

        // Update foreign key reference (if it exists) to the new table name
        await queryInterface.removeConstraint('FoodLabels', 'fk_food_labels_labels');
        await queryInterface.addConstraint('FoodLabels', {
            type: 'foreign key',
            name: 'FoodLabels_labelId_fkey',
            fields: ['labelId'],
            references: {
                table: 'Labels',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION'
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column renaming back to original names
        await queryInterface.renameColumn('FoodLabels', 'labelId', 'label_id');
        await queryInterface.renameColumn('FoodLabels', 'createdAt', 'created_at');
        await queryInterface.renameColumn('FoodLabels', 'updatedAt', 'updated_at');

        // Revert createdAt and updatedAt columns to their original types
        await queryInterface.changeColumn('FoodLabels', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.changeColumn('FoodLabels', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false
        });

        // Remove the updated foreign key constraint
        await queryInterface.removeConstraint('FoodLabels', 'FoodLabels_labelId_fkey');

        // Add back the original foreign key constraint
        await queryInterface.addConstraint('food_labels', {
            type: 'foreign key',
            name: 'fk_food_labels_labels',
            fields: ['label_id'],
            references: {
                table: 'Labels',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION'
        });

        // Rename table back to 'food_labels'
        await queryInterface.renameTable('FoodLabels', 'food_labels');
    }
};
