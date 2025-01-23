'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'street_address', {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: 'Street address of the user'
    });
    
    await queryInterface.addColumn('users', 'city', {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: 'City of residence'
    });

    await queryInterface.addColumn('users', 'state', {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: 'State of residence'
    });

    await queryInterface.addColumn('users', 'zip_code', {
      type: Sequelize.STRING(20), // Adjust length as necessary
      allowNull: false,
      comment: 'Zip or postal code'
    });

    await queryInterface.addColumn('users', 'country', {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: 'Country of residence'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'street_address');
    await queryInterface.removeColumn('users', 'city');
    await queryInterface.removeColumn('users', 'state');
    await queryInterface.removeColumn('users', 'zip_code');
    await queryInterface.removeColumn('users', 'country');
  }
};


