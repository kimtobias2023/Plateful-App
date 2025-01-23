module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            'recipe_media',
            'created_at',
            {
                type: Sequelize.DATE,
                allowNull: true,
            }
        );
        await queryInterface.addColumn(
            'recipe_media',
            'updated_at',
            {
                type: Sequelize.DATE,
                allowNull: true,
            }
        );

        await queryInterface.sequelize.query(`UPDATE recipe_media SET created_at = NOW(), updated_at = NOW() WHERE created_at IS NULL OR updated_at IS NULL`);

        await queryInterface.changeColumn(
            'recipe_media',
            'created_at',
            {
                type: Sequelize.DATE,
                allowNull: false,
            }
        );
        await queryInterface.changeColumn(
            'recipe_media',
            'updated_at',
            {
                type: Sequelize.DATE,
                allowNull: false,
            }
        );
    },
    down: async (queryInterface, Sequelize) => {
        // your down migration here
    },
};


