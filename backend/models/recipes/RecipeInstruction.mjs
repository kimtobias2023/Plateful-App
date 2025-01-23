import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';

class RecipeInstruction extends Model { }

RecipeInstruction.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "Unique identifier for the step within a section"
    },
    sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'RecipeInstructionSections', // Updated reference to the new table
            key: 'id'
        },
        comment: "Reference to the associated recipe instruction section"
    },
    stepNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Number indicating the sequence of the step"
    },
    instruction: {
        type: DataTypes.TEXT,
        allowNull: false, // Assuming instruction is always required, change if necessary
        comment: "Detailed instruction for the step"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Timestamp when the instruction was created"
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false, // Assuming you always want to track updates, change if necessary
        defaultValue: Sequelize.NOW,
        comment: "Timestamp of the last update to the instruction"
    }
}, {
    sequelize,
    modelName: 'RecipeInstruction',
    tableName: 'RecipeInstructions',
    timestamps: true, // Assuming you want Sequelize to handle createdAt and updatedAt automatically
});

export default RecipeInstruction;





