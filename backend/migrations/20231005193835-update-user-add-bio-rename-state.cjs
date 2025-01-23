'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding the bio column
    await queryInterface.addColumn('users', 'bio', {
      type: Sequelize.STRING(1000),
      allowNull: true,
      comment: 'Short bio or description about the user'
    });
    
    // Renaming the state column to state_province_region
    await queryInterface.renameColumn('users', 'state', 'state_province_region');
  },

  down: async (queryInterface, Sequelize) => {
    // Removing the bio column
    await queryInterface.removeColumn('users', 'bio');
    
    // Renaming state_province_region back to state
    await queryInterface.renameColumn('users', 'state_province_region', 'state');
  }
};

