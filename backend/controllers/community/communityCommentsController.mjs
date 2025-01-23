
import { 
    createComment, 
    getCommentById, 
    updateComment, 
    deleteComment 
} from '../../services/community/communityCommentService.mjs';

const createCommunityComment = async (req, res) => {
    try {
        const commentData = req.body;
        const comment = await createComment(commentData);
        res.status(201).json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Failed to create comment" });
    }
};

const getCommunityCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await getCommentById(id);
        if (!comment) {
            res.status(404).json({ error: "Comment not found" });
        } else {
            res.json(comment);
        }
    } catch (error) {
        console.error("Error getting comment by ID:", error);
        res.status(500).json({ error: "Failed to get comment" });
    }
};

const updateCommunityComment = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const comment = await updateComment(id, updatedData);
        if (!comment) {
            res.status(404).json({ error: "Comment not found" });
        } else {
            res.json(comment);
        }
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ error: "Failed to update comment" });
    }
};

const deleteCommunityComment = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteComment(id);
        if (!result) {
            res.status(404).json({ error: "Comment not found" });
        } else {
            res.json({ message: "Comment deleted successfully" });
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Failed to delete comment" });
    }
};

export {
    createCommunityComment,
    getCommunityCommentById,
    updateCommunityComment,
    deleteCommunityComment
};
