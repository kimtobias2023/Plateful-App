import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class RecipeInstructionSection extends Model { }

RecipeInstructionSection.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "Unique identifier for the recipe instruction section"
    },
    instructionHeader: {
        type: DataTypes.STRING(255),
        comment: "Header or title of the instruction section, e.g., 'Preparation Steps', 'Baking Steps'"
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
        comment: "Number indicating the sequence of the instruction section within the recipe"
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
    modelName: 'RecipeInstructionSection',
    tableName: 'RecipeInstructionSections',
    timestamps: true, // Assuming you want Sequelize to automatically manage createdAt and updatedAt
});

export default RecipeInstructionSection;
