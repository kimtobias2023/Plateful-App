'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Drop the foreign key constraint
        await queryInterface.removeConstraint('meal_recipes', 'meal_recipes_mealtype_id_fkey');

        // Now drop the meal_types table
        await queryInterface.sequelize.query('DROP TABLE IF EXISTS public.meal_types;');
    },

    down: async (queryInterface, Sequelize) => {
        // Logic to revert the migration (re-creating the meal_types table and re-adding the constraint)
    }
};


