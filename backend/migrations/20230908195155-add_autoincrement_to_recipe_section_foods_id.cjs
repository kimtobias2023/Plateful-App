'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create a sequence for recipe_section_foods id
        await queryInterface.sequelize.query(
            `CREATE SEQUENCE recipe_section_foods_id_seq START WITH 1 INCREMENT BY 1;`
        );

        // Alter the id column to use the new sequence as its default value
        await queryInterface.sequelize.query(
            `ALTER TABLE public.recipe_section_foods ALTER COLUMN id SET DEFAULT nextval('recipe_section_foods_id_seq');`
        );

        // Make the sequence owned by the id column in recipe_section_foods
        await queryInterface.sequelize.query(
            `ALTER SEQUENCE recipe_section_foods_id_seq OWNED BY public.recipe_section_foods.id;`
        );
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the default value from the id column
        await queryInterface.sequelize.query(
            `ALTER TABLE public.recipe_section_foods ALTER COLUMN id DROP DEFAULT;`
        );

        // Drop the sequence
        await queryInterface.sequelize.query(
            `DROP SEQUENCE recipe_section_foods_id_seq;`
        );
    }
};

