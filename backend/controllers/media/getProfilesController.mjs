import User from '../../../models/sequelize/profile/User.mjs';
import UserMedia from '../../../models/sequelize/media/UserMedia.mjs';

const getProfilesController = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'streetAddress', 'city', 'stateProvinceRegion', 'zipCode', 'country', 'gender', 'birthday', 'bio', 'createdAt', 'updatedAt'],
            include: [{
                model: UserMedia,
                attributes: ['id', 'mediaType', 'mediaUrl', 'mediaLabel', 'createdAt', 'updatedAt']
            }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Error fetching user profile.' });
    }
};

export { getProfilesController };

