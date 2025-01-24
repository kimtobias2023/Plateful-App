'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`CREATE SEQUENCE user_media_id_seq;`);
        await queryInterface.sequelize.query(`
      ALTER TABLE public.user_media 
      ALTER COLUMN id 
      SET DEFAULT nextval('user_media_id_seq');
    `);
        await queryInterface.sequelize.query(`
      ALTER SEQUENCE user_media_id_seq 
      OWNED BY public.user_media.id;
    `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
      ALTER TABLE public.user_media
      ALTER COLUMN id DROP DEFAULT;
    `);
        await queryInterface.sequelize.query(`DROP SEQUENCE user_media_id_seq;`);
    }
};

