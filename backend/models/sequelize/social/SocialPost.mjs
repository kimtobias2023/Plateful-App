// community/communityPost.js

import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize-instance.mjs';

class SocialPost extends Model { }

SocialPost.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: "Unique identifier for each post"
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',  // name of the reference table
            key: 'id'
        },
        comment: "Identifier of the user who created the post"
    },
    post_title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Title of the community post"
    },
    post_content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Content body of the community post"
    },
    post_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Date when the post was made"
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Date and time when the record was created"
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Date and time when the record was last updated"
    },
}, {
    sequelize,
    modelName: 'social_post',
    tableName: 'social_posts',
    timestamps: true,  // set to false since you're manually defining the columns
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default SocialPost;
