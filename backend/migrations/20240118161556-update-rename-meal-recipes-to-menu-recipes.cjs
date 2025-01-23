'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.transaction(async (transaction) => {
            // Rename meal_recipes to MenuRecipes
            await queryInterface.renameTable('meal_recipes', 'MenuRecipes', { transaction });

            // Rename columns
            await queryInterface.renameColumn('MenuRecipes', 'mealplan_id', 'mealPlanId', { transaction });
            await queryInterface.renameColumn('MenuRecipes', 'recipe_id', 'recipeId', { transaction });
            await queryInterface.renameColumn('MenuRecipes', 'created_at', 'createdAt', { transaction });
            await queryInterface.renameColumn('MenuRecipes', 'updated_at', 'updatedAt', { transaction });

            // Add mealType column
            await queryInterface.addColumn(
                'MenuRecipes',
                'mealType',
                {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                { transaction }
            );

            // Drop mealtype_id column if it exists
            await queryInterface.removeColumn('MenuRecipes', 'mealtype_id', { transaction });
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Add logic to revert the migration if needed
    }
};

