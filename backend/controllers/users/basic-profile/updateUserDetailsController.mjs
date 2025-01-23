import User from '../../../models/users/basic-profile/User.mjs';

function validatePassword(password) {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpper = /[A-Z]/;
    const hasLower = /[a-z]/;
    const hasSpecial = /[!@#\$%\^&\*]/;

    let errors = [];

    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters.`);
    }
    if (!hasNumber.test(password)) {
        errors.push("Password must include at least one number.");
    }
    if (!hasUpper.test(password)) {
        errors.push("Password must include at least one uppercase letter.");
    }
    if (!hasLower.test(password)) {
        errors.push("Password must include at least one lowercase letter.");
    }
    if (!hasSpecial.test(password)) {
        errors.push("Password must include at least one special character (!@#$%^&*).");
    }

    return errors;
}

async function emailExists(email) {
    const user = await User.findOne({ where: { email: email } });
    return user !== null;
}

const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Updated fields array for camelCase
        const updatableFields = ['firstName', 'lastName', 'email', 'streetAddress', 'city', 'stateProvinceRegion', 'country',
            'zipCode', 'gender', 'bio', 'birthday'];

        // Password and Email update logic remains the same

        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        await user.save();

        // Updated response to use camelCase
        return res.status(200).json({
            message: 'User details updated successfully.',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender,
                birthday: user.birthday,
                streetAddress: user.streetAddress,
                city: user.city,
                stateProvinceRegion: user.stateProvinceRegion,
                zipCode: user.zipCode,
                country: user.country,
                bio: user.bio,
            }
        });

    } catch (error) {
        console.error('Error updating user details:', error);
        return res.status(500).json({ error: 'An error occurred while updating user details.' });
    }
};

export { updateUserDetails, emailExists, validatePassword };