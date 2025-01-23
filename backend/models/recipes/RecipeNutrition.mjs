import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';


class RecipeNutrition extends Model { }

RecipeNutrition.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Recipes', // This is the name of the table, ensure it matches your setup
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    calories: {
        type: DataTypes.INTEGER,
    },
    proteinContent: {
        type: DataTypes.INTEGER,
    },
    fatContent: {
        type: DataTypes.INTEGER,
    },
    carbohydrateContent: {
        type: DataTypes.INTEGER,
    },
    saturatedFatContent: {
        type: DataTypes.INTEGER,
    },
    unsaturatedFatContent: {
        type: DataTypes.INTEGER,
    },
    fiberContent: {
        type: DataTypes.INTEGER,
    },
    cholesterolContent: {
        type: DataTypes.INTEGER,
    },
    sugarContent: {
        type: DataTypes.INTEGER,
    },
    sodiumContent: {
        type: DataTypes.INTEGER,
    },
    servingSize: {
        type: DataTypes.STRING(255),
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize, // This is the sequelize instance
    modelName: 'RecipeNutrition',
    tableName: 'RecipeNutrition',
    timestamps: true, // If your table explicitly defines the createdAt and updatedAt columns, set this to true
});

export default RecipeNutrition;
