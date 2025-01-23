import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';


class Label extends Model { }

Label.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "Unique identifier for the label"
    },
    labelName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true, // Ensure label names are unique
        comment: "Name of the label"
    },
    labelType: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Type of the label, if applicable"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "Date and time when the label was created"
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "Date and time when the label was last updated"
    }
}, {
    sequelize,
    modelName: 'Label',
    tableName: 'Labels',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});


export default Label;


