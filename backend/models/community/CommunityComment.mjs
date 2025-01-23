import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize-instance.mjs';

class CommunityComment extends Model { }

CommunityComment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: "Unique identifier for each comment record"
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'community_posts',  // name of the reference table
            key: 'id'
        },
        comment: "Identifier of the post this comment belongs to"
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',  // name of the reference table
            key: 'id'
        },
        comment: "Identifier of the user who made the comment"
    },
    comment_text: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Text content of the comment"
    },
    comment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: "Date when the comment was posted"
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
    modelName: 'CommunityComment',
    tableName: 'community_comments',
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default CommunityComment;
