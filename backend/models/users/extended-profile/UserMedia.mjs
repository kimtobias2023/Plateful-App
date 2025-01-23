import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';
import User from '../basic-profile/User.mjs';

class UserMedia extends Model { }

UserMedia.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    mediaType: { // Updated to camelCase
        type: DataTypes.STRING,
        allowNull: true,
    },
    mediaLabel: { // Updated to camelCase
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Descriptive label for the media type (e.g., profile_img, carousel_img)'
    },
    userId: { // Updated to camelCase
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Updated to match the class name of the User model
            key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'Reference to the user associated with the media'
    },
    mediaUrl: { // Updated to camelCase
        type: DataTypes.TEXT,
        allowNull: true,
    },
    s3Key: { // Updated to camelCase
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'The S3 key for the media file'
    },
    createdAt: { // Updated to camelCase
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date and time when the media was uploaded'
    },
    updatedAt: { // Updated to camelCase
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date and time when the media was last updated'
    },
}, {
    sequelize,
    modelName: 'UserMedia',
    tableName: 'UserMedias', // Updated to match the renamed table
    underscored: false, // Updated since we are now using camelCase
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

export default UserMedia;

