'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Rename table to RecipeSectionSteps
        await queryInterface.renameTable('recipe_section_steps', 'RecipeSectionSteps');

        // Rename columns to camelCase
        await queryInterface.renameColumn('RecipeSectionSteps', 'section_id', 'sectionId');
        await queryInterface.renameColumn('RecipeSectionSteps', 'step_number', 'stepNumber');
        await queryInterface.renameColumn('RecipeSectionSteps', 'instruction_header', 'instructionHeader');
        await queryInterface.renameColumn('RecipeSectionSteps', 'recipe_notes', 'recipeNotes');
        await queryInterface.renameColumn('RecipeSectionSteps', 'created_at', 'createdAt');
        await queryInterface.renameColumn('RecipeSectionSteps', 'updated_at', 'updatedAt');

        // Update createdAt and updatedAt to use time zones
        await queryInterface.changeColumn('RecipeSectionSteps', 'createdAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
        await queryInterface.changeColumn('RecipeSectionSteps', 'updatedAt', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert column renaming back to original names
        await queryInterface.renameColumn('RecipeSectionSteps', 'sectionId', 'section_id');
        await queryInterface.renameColumn('RecipeSectionSteps', 'stepNumber', 'step_number');
        await queryInterface.renameColumn('RecipeSectionSteps', 'instructionHeader', 'instruction_header');
        await queryInterface.renameColumn('RecipeSectionSteps', 'recipeNotes', 'recipe_notes');
        await queryInterface.renameColumn('RecipeSectionSteps', 'createdAt', 'created_at');
        await queryInterface.renameColumn('RecipeSectionSteps', 'updatedAt', 'updated_at');

        // Revert createdAt and updatedAt columns to their original types
        await queryInterface.changeColumn('RecipeSectionSteps', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.changeColumn('RecipeSectionSteps', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false
        });

        // Rename table back to 'recipe_section_steps'
        await queryInterface.renameTable('RecipeSectionSteps', 'recipe_section_steps');
    }
};

