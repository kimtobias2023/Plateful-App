'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table to RecipeSectionIngredients
        await queryInterface.renameTable('recipe_section_foods', 'RecipeSectionIngredients');

        // Rename columns to camelCase
        await queryInterface.renameColumn('RecipeSectionIngredients', 'section_id', 'sectionId');
        await queryInterface.renameColumn('RecipeSectionIngredients', 'food_notes', 'foodNotes');
        await queryInterface.renameColumn('RecipeSectionIngredients', 'created_at', 'createdAt');
        await queryInterface.renameColumn('RecipeSectionIngredients', 'updated_at', 'updatedAt');

        // Update createdAt and updatedAt to use time zones
        await queryInterface.changeColumn('RecipeSectionIngredients', 'createdAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
        await queryInterface.changeColumn('RecipeSectionIngredients', 'updatedAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });

        // Update foreign key reference (if it exists) to the new table name
        // Ensure to modify the constraint name and table name as per your actual database schema
        await queryInterface.removeConstraint('RecipeSectionIngredients', 'recipe_section_foods_section_id_fkey');
        await queryInterface.addConstraint('RecipeSectionIngredients', {
            type: 'foreign key',
            name: 'RecipeSectionIngredients_sectionId_fkey',
            fields: ['sectionId'],
            references: {
                table: 'RecipeSections',
                field: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column renaming back to original names
        await queryInterface.renameColumn('RecipeSectionIngredients', 'sectionId', 'section_id');
        await queryInterface.renameColumn('RecipeSectionIngredients', 'foodNotes', 'food_notes');
        await queryInterface.renameColumn('RecipeSectionIngredients', 'createdAt', 'created_at');
        await queryInterface.renameColumn('RecipeSectionIngredients', 'updatedAt', 'updated_at');

        // Revert createdAt and updatedAt columns to their original types
        await queryInterface.changeColumn('RecipeSectionIngredients', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.changeColumn('RecipeSectionIngredients', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false
        });

        // Remove the updated foreign key constraint
        await queryInterface.removeConstraint('RecipeSectionIngredients', 'RecipeSectionIngredients_sectionId_fkey');

        // Add back the original foreign key constraint
        await queryInterface.addConstraint('recipe_section_foods', {
            type: 'foreign key',
            name: 'recipe_section_foods_section_id_fkey',
            fields: ['section_id'],
            references: {
                table: 'RecipeSections',
                field: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        });

        // Rename table back to 'recipe_section_foods'
        await queryInterface.renameTable('RecipeSectionIngredients', 'recipe_section_foods');
    }
};

