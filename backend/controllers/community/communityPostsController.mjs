import {
    createPost,
    getPostById,
    updatePost,
    deletePost,
    getAllPosts
} from '../../services/community/communityPostService.mjs';

const createCommunityPost = async (req, res) => {
    try {
        const postData = req.body;
        const newPost = await createPost(postData);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCommunityPostById = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await getPostById(postId);
        res.status(200).json(post);
    } catch (error) {
        if (error.message === 'Post not found') {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

const updateCommunityPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const updatedData = req.body;
        const updatedPost = await updatePost(postId, updatedData);
        res.status(200).json(updatedPost);
    } catch (error) {
        if (error.message === 'Post not found') {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

const deleteCommunityPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const result = await deletePost(postId);
        if (result.message === 'Post deleted successfully') {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        if (error.message === 'Post not found') {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

const getAllCommunityPosts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const posts = await getAllPosts(limit, offset);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export {
    createCommunityPost,
    getCommunityPostById,
    updateCommunityPost,
    deleteCommunityPost,
    getAllCommunityPosts
};

