'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding the username column
    await queryInterface.addColumn('users', 'username', {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true, // Ensures usernames are unique
      comment: 'Unique username for the user'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Removing the username column
    await queryInterface.removeColumn('users', 'username');
  }
};

