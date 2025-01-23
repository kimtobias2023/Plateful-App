// File: unit.js within the sequelize/units folder
import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';

class Unit extends Model { }

Unit.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    unitName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    abbreviation: {
        type: DataTypes.STRING,
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
    },
}, {
    sequelize,
    modelName: 'Unit',
    tableName: 'Units',
    timestamps: true,
    freezeTableName: true, // Ensures that the table name is not pluralized
});

export default Unit;

