import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class RecipeMedia extends Model { }

RecipeMedia.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "Unique identifier for each media entry"
    },
    mediaType: {
        type: DataTypes.STRING,  // Assuming VARCHAR type for mediaType
        allowNull: true,
        comment: "Type of media content (e.g., image, video)"
    },
    recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Recipes', // Ensure this matches your Recipes model name
            key: 'id'
        },
        comment: "Reference to the related recipe"
    },
    s3Key: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Key for the media stored in AWS S3"
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
    modelName: 'RecipeMedia',
    tableName: 'RecipeMedias',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

export default RecipeMedia;





