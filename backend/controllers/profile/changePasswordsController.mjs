import bcrypt from 'bcryptjs';
import User from '../../../models/sequelize/profile/User.mjs';

const changePasswords = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.userId; // Assuming you're extracting userId from the JWT token in a middleware

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Both old and new passwords are required.' });
        }

        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Verify old password
        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Old password is incorrect.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password updated successfully.' });

    } catch (error) {
        console.error('Error while changing password:', error);
        return res.status(500).json({ error: 'An error occurred while changing the password. Please try again.' });
    }
};

export { changePasswords };
