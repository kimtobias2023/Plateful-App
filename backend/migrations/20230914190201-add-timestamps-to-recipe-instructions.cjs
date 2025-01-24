module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add columns with a temporary null allowance
        await queryInterface.addColumn('recipe_section_steps', 'created_at', {
            type: Sequelize.DATE,
            allowNull: true,
        });
        await queryInterface.addColumn('recipe_section_steps', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: true,
        });

        // Update the null fields to the current timestamp
        await queryInterface.sequelize.query(
            `UPDATE recipe_section_steps SET created_at = NOW(), updated_at = NOW() WHERE created_at IS NULL OR updated_at IS NULL`
        );

        // Change the columns to not allow null values
        await queryInterface.changeColumn('recipe_section_steps', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
        });
        await queryInterface.changeColumn('recipe_section_steps', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('recipe_section_steps', 'created_at');
        await queryInterface.removeColumn('recipe_section_steps', 'updated_at');
    },
};


