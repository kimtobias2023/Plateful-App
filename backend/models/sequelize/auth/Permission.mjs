import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class Permission extends Model { }

Permission.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {  // Updated to camelCase
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {  // Updated to camelCase
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    sequelize,
    modelName: 'Permission',
    tableName: 'Permissions',  // Updated to match the renamed table
    timestamps: true,
    underscored: false  // Updated since we are now using camelCase
});

export default Permission;

