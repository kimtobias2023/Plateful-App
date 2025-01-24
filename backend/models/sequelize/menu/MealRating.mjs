
import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class MealRating extends Model { }

MealRating.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: "Unique identifier for each meal rating record"
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        comment: "Identifier of the user who rated the meal"
    },
    meal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Identifier of the rated meal, whether it's a recipe or a restaurant meal"
    },
    meal_type: {
        type: DataTypes.ENUM('recipe', 'restaurant'),
        allowNull: false,
        comment: "Identifies if the meal is a home-cooked recipe or a restaurant meal"
    },
    taste_rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 1,
            max: 5
        },
        comment: "Taste rating of the meal. Null indicates unrated."
    },
    time_rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 1,
            max: 5
        },
        comment: "For home-cooked meals: Time efficiency rating in terms of preparation and cooking. For restaurant meals: Rating encompasses driving, waiting, and overall dining duration. Null indicates unrated."
    },
    health_rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        },
        comment: "Rating for the perceived healthiness of the meal"
    },
    difficulty_rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        },
        comment: "Rating for the difficulty of the meal"
    },
    health_rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        },
        comment: "Rating for the perceived healthiness of the meal"
    },
    // Additional columns can be added as necessary...
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Date and time when the rating was given"
    },
}, {
    sequelize,
    modelName: 'MealRating',
    tableName: 'meal_ratings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default MealRating;

