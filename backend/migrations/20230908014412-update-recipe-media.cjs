'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(
            `CREATE SEQUENCE IF NOT EXISTS recipe_media_id_seq START WITH 1 INCREMENT BY 1;`
        );

        await queryInterface.sequelize.query(
            `ALTER TABLE public.recipe_media ALTER COLUMN id SET DEFAULT nextval('recipe_media_id_seq');`
        );

        await queryInterface.sequelize.query(
            `ALTER SEQUENCE recipe_media_id_seq OWNED BY public.recipe_media.id;`
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(
            `ALTER TABLE public.recipe_media ALTER COLUMN id DROP DEFAULT;`
        );

        await queryInterface.sequelize.query(
            `DROP SEQUENCE recipe_media_id_seq;`
        );
    }
};
