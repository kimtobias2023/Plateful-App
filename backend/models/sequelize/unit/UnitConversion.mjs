// File: unitConversion.js within the sequelize/unitConversions folder
import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class UnitConversion extends Model { }

UnitConversion.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: "Unique identifier for a unit conversion entry"
    },
    fromUnit: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Unit being converted from"
    },
    toUnit: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Unit being converted to"
    },
    conversionFactor: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        comment: "Factor by which 'fromUnit' is multiplied to get 'toUnit'"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date and time when the entry was created'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date and time when the entry was last updated'
    }
}, {
    sequelize,
    modelName: 'UnitConversion',
    tableName: 'UnitConversions', // Ensure this matches your actual table name
    timestamps: true,
    freezeTableName: true  // To ensure the table name stays exactly as defined
});

export default UnitConversion;

