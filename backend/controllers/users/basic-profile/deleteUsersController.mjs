import User from '../../../models/users/basic-profile/User.mjs';

const deleteUsers = async (req, res) => {
    try {
        // Assuming the user's ID is stored in req.user.id after authentication
        const userId = req.user.id;

        // Fetch the user to ensure they exist
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user
        await user.destroy();

        // Optionally, clean up other references or associated data here
        // E.g., if you have posts, comments, or other related data to the user
        // Consider doing this cleanup in background jobs if it's extensive

        // Send a success response
        return res.status(200).json({ message: 'User account deleted successfully.' });

    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { deleteUsers };
