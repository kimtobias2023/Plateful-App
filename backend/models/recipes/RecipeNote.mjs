import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';

class RecipeNote extends Model { }

RecipeNote.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "Unique identifier for the note"
    },
    recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Recipes', // This should match the table name as defined in Sequelize
            key: 'id'
        },
        comment: "Reference to the associated recipe"
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "The content of the note"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Timestamp when the note was created"
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Timestamp of the last update to the note"
    }
}, {
    sequelize,
    modelName: 'RecipeNote',
    tableName: 'RecipeNotes',
    timestamps: true, 
});

export default RecipeNote;