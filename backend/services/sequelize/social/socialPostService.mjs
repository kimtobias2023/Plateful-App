

import SocialPost from '../../../models/sequelize/social/SocialPost.mjs';

const createPost = async (postData) => {
    return await SocialPost.create(postData);
};

const getPostById = async (id) => {
    return await SocialPost.findByPk(id);
};

const updatePost = async (id, updatedData) => {
    const post = await SocialPost.findByPk(id);
    if (!post) throw new Error('Post not found');
    return await post.update(updatedData);
};

const deletePost = async (id) => {
    const post = await SocialPost.findByPk(id);
    if (!post) throw new Error('Post not found');
    await post.destroy();
    return { message: 'Post deleted successfully' };
};

const getAllPosts = async (limit = 10, offset = 0) => {
    return await SocialPost.findAll({
        limit: limit,
        offset: offset,
        order: [['post_date', 'DESC']]
    });
};

export {
    createPost,
    getPostById,
    updatePost,
    deletePost,
    getAllPosts
};
