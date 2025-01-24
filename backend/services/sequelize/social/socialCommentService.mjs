import { SocialComment } from '../../../models/sequelize/social/index.mjs';

const createComment = async (commentData) => {
    try {
        const comment = await SocialComment.create(commentData);
        return comment;
    } catch (error) {
        throw error;
    }
};

const getCommentById = async (id) => {
    try {
        const comment = await SocialComment.findByPk(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        return comment;
    } catch (error) {
        throw error;
    }
};

const updateComment = async (id, updatedData) => {
    try {
        const comment = await SocialComment.findByPk(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        await comment.update(updatedData);
        return comment;
    } catch (error) {
        throw error;
    }
};

const deleteComment = async (id) => {
    try {
        const comment = await SocialComment.findByPk(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        await comment.destroy();
        return true;
    } catch (error) {
        throw error;
    }
};

export {
    createComment,
    getCommentById,
    updateComment,
    deleteComment
};
