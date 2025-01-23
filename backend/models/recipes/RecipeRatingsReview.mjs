import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';

class RecipeRatingsReview extends Model { }

RecipeRatingsReview.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: "Unique identifier for the rating or review"
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        comment: "Reference to the user who provided the rating or review"
    },
    review: {
        type: DataTypes.TEXT,
        comment: "Textual review of the recipe"
    },
    tasteRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Rating for the taste of the recipe"
    },
    timeRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Rating for the time taken to prepare the recipe"
    },
    difficultyRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Rating for the difficulty level of the recipe"
    },
    healthRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Rating for the healthiness of the recipe"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Date and time when the rating/review was created"
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Date and time when the rating/review was last updated"
    },
}, {
    sequelize,
    modelName: 'RecipeRatingsReview',
    tableName: 'RecipeRatingsReviews',
    timestamps: true, // Set to true for auto handling of createdAt & updatedAt
});

export default RecipeRatingsReview;
