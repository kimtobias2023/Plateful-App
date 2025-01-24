import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';


class Recipe extends Model { }

Recipe.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "Unique identifier for the recipe"
    },
    recipeName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Name or title of the recipe"
    },
    recipeLink: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        },
        comment: "Link to the original source of the recipe, if any"
    },
    recipeDescription: {
        type: DataTypes.TEXT,
        comment: "Brief description or introduction of the recipe"
    },
    preparationTime: {
        type: DataTypes.INTEGER,
        validate: {
            min: 0
        },
        comment: "Time required for the preparation phase in minutes"
    },
    cookingTime: {
        type: DataTypes.STRING,
        comment: "Time required for cooking the recipe"
    },
    totalTime: {
        type: DataTypes.STRING,
        comment: "Total time required from start to finish"
    },
    servings: {
        type: DataTypes.INTEGER,
        comment: "Number of servings or portions the recipe produces"
    },
    websiteUrl: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        },
        comment: "Website link where the recipe is hosted or published"
    },
    author: {
        type: DataTypes.STRING,
        comment: "Author or creator of the recipe"
    },
    recipeImageUrl: {
        type: DataTypes.TEXT,
        validate: {
            isUrl: true
        },
        comment: "URL of the recipe image"
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
    }
}, {
    sequelize,
    modelName: 'Recipe',
    tableName: 'Recipes',
    timestamps: true // Enable automatic handling of createdAt and updatedAt
});


export default Recipe;








