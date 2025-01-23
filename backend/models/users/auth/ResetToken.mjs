import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class ResetToken extends Model { }

ResetToken.init({
    id: { // token_id: Auto-incremented primary key
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Unique identifier for each reset token record'
    },
    userId: { // User's ID: foreign key relationship, updated to camelCase
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to the user who requested the password reset',
        references: {
            model: 'Users', // Updated to match the class name of the User model
            key: 'id'
        }
    },
    token: { // token: Actual JWT token
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'JWT token for password reset'
    },
    expiresAt: { // expires_at: Expiry date/time for the token, updated to camelCase
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date and time when the token expires'
    }
}, {
    sequelize,
    modelName: 'ResetToken',
    tableName: 'ResetTokens', // Updated to match the renamed table
    underscored: false, // Updated since we are now using camelCase
    timestamps: true, // Enables createdAt and updatedAt fields
    comment: 'Table for storing password reset tokens along with their expiration details'
});

export default ResetToken;

