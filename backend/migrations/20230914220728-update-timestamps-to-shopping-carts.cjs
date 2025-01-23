'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('shopping_carts', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });

        await queryInterface.addColumn('shopping_carts', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        });

        await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION trigger_set_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

        await queryInterface.sequelize.query(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON shopping_carts
      FOR EACH ROW
      EXECUTE FUNCTION trigger_set_timestamp();
    `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('shopping_carts', 'created_at');
        await queryInterface.removeColumn('shopping_carts', 'updated_at');

        await queryInterface.sequelize.query(`
      DROP TRIGGER set_timestamp ON shopping_carts;
    `);

        await queryInterface.sequelize.query(`
      DROP FUNCTION trigger_set_timestamp;
    `);
    },
};


