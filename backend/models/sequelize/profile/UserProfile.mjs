import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';
import User from './User.mjs'; // Assuming the User model is in the same directory

class UserProfile extends Model {}

UserProfile.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Reference to the User model
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    postalCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
}, {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles', // Match the table name in the database
    timestamps: true, // Enables createdAt and updatedAt
    underscored: false, // Use camelCase field names
});

export default UserProfile;

