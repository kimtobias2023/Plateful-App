import CommunityPost from '../../models/community/CommunityPost.mjs';

const createPost = async (postData) => {
    return await CommunityPost.create(postData);
};

const getPostById = async (id) => {
    return await CommunityPost.findByPk(id);
};

const updatePost = async (id, updatedData) => {
    const post = await CommunityPost.findByPk(id);
    if (!post) throw new Error('Post not found');
    return await post.update(updatedData);
};

const deletePost = async (id) => {
    const post = await CommunityPost.findByPk(id);
    if (!post) throw new Error('Post not found');
    await post.destroy();
    return { message: 'Post deleted successfully' };
};

const getAllPosts = async (limit = 10, offset = 0) => {
    return await CommunityPost.findAll({
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
