const sequelize = require('./config/sequelize-instance');
const Recipe = require('./models/sequelize/recipes/recipe');
const GroceryItem = require('./models/groceries/groceryItem'); // Import the GroceryItem model

(async () => {
    try {
        await sequelize.sync(); // This synchronizes all models with the database
        console.log('Database synchronized');

        console.log('Creating grocery_items table...');
        await sequelize.getQueryInterface().createTable('grocery_items', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                // No need for comment here since it's self-explanatory
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                // Add a comment describing the purpose of this column
                comment: "Name of the grocery item"
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
                // Add a comment describing the purpose of this column
                comment: "Description of the grocery item"
            },
            // Add any additional columns and constraints as needed
        });

        console.log('grocery_items table created');

    } catch (error) {
        console.error('Database synchronization error:', error);
    } finally {
        sequelize.close(); // Close the database connection after synchronization
    }
})();

