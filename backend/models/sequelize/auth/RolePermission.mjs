import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class RolePermission extends Model { }

RolePermission.init({
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Roles', // Updated to match the class name of the Role model
            key: 'id'
        }
    },
    permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Permissions', // Updated to match the class name of the Permission model
            key: 'id'
        }
    },
    createdAt: { // Updated to camelCase
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: { // Updated to camelCase
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'RolePermissions', // Updated to match the renamed table
    timestamps: true,
    underscored: false // Updated since we are now using camelCase
});

export default RolePermission;
