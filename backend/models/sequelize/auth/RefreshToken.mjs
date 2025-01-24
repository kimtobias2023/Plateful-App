import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class RefreshToken extends Model { }

RefreshToken.init({
    userId: {  // Updated to camelCase
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',  // Updated to match the renamed table
            key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expiresAt: {  // Updated to camelCase
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'RefreshTokens',  // Updated to match the renamed table
    underscored: false,  // Updated since we are now using camelCase
});

export default RefreshToken;

