import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class RecipeLabel extends Model { }

RecipeLabel.init({
    recipeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Recipes', // This should match the table name in your DB
            key: 'id'
        },
        comment: "Reference to the recipe being associated"
    },
    labelId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Labels', // This should match the table name in your DB
            key: 'id'
        },
        comment: "Reference to the label being associated"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Timestamp when the association was created"
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Timestamp of the last update to the association"
    }
}, {
    sequelize,
    modelName: 'RecipeLabel',
    tableName: 'RecipeLabels', // Ensure this matches your DB table name exactly
    timestamps: true, // This should be true if you want Sequelize to handle `createdAt` and `updatedAt`
    createdAt: 'createdAt', // Ensure these match the field names in your table
    updatedAt: 'updatedAt'
});

export default RecipeLabel;








