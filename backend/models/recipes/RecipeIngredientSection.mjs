import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';

class RecipeIngredientSection extends Model { }

RecipeIngredientSection.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "Unique identifier for the recipe ingredient section"
    },
    ingredientHeader: { // Updated to reflect the new column name
        type: DataTypes.STRING(255),
        comment: "Header or title of the ingredient section, e.g., 'For the cake', 'For the icing'"
    },
    recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Recipes',
            key: 'id'
        },
        comment: "Reference to the associated recipe"
    },
    sectionOrder: {
        type: DataTypes.INTEGER,
        comment: "Number indicating the sequence of the ingredient section within the recipe"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Date and time when the record was created"
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Date and time when the record was last updated"
    },
}, {
    sequelize,
    modelName: 'RecipeIngredientSection', // Updated model name
    tableName: 'RecipeIngredientSections', // Updated table name
    timestamps: false, // Manually defining the columns
});

export default RecipeIngredientSection;






