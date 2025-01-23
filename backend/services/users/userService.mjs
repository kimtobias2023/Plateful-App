import User from '../../models/users/User.mjs';
import bcrypt from 'bcrypt';

async function registerUser(userData, transaction = null) {
    try {
        const newUser = await User.create(userData, { transaction });
        newUser.password = undefined; // Never return the password
        return newUser;
    } catch (error) {
        console.error("Error in registerUser:", error);
        throw error;
    }
}

async function loginUser(email, password, transaction = null) {
    try {
        const user = await User.findOne({ where: { email }, transaction });
        if (!user) {
            throw new Error('User not found.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password.');
        }

        user.password = undefined; // Never return the password
        return user;
    } catch (error) {
        console.error("Error in loginUser:", error);
        throw error;
    }
}

async function getUserById(userId, transaction = null) {
    try {
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            throw new Error('User not found.');
        }

        user.password = undefined; // Never return the password
        return user;
    } catch (error) {
        console.error("Error in getUserById:", error);
        throw error;
    }
}

async function updateUser(userId, updatedData, transaction = null) {
    try {
        const result = await User.update(updatedData, {
            where: { id: userId },
            transaction
        });

        if (result[0] === 1) {
            const updatedUser = await User.findByPk(userId, { transaction });
            updatedUser.password = undefined; // Never return the password
            return updatedUser;
        } else {
            throw new Error('Update failed or no matching user found.');
        }
    } catch (error) {
        console.error("Error in updateUser:", error);
        throw error;
    }
}

async function deleteUser(userId, transaction = null) {
    try {
        const result = await User.destroy({
            where: { id: userId },
            transaction
        });
        return result; // Returns the number of records deleted (should be 0 or 1)
    } catch (error) {
        console.error("Error in deleteUser:", error);
        throw error;
    }
}

export {
    registerUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
};



