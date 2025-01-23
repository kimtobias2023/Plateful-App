import generateTokenForUser from '../utils/tokenUtils.mjs';

export function generateTokenMiddleware(req, res) {
    try {
        // Assuming you've stored the user details (either Sequelize or Mongoose) 
        // in the req object during registration, like req.user
        const token = generateTokenForUser(req.user);

        res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'none' });
        res.status(201).json({ message: 'User created successfully.', token: token });

    } catch (err) {
        console.error('JWT Error:', err.message);
        const errorMessage = err.message === 'Unexpected JWT signing error.'
            ? err.message
            : process.env.NODE_ENV === 'development'
                ? err.message
                : 'An error occurred while signing up.';
        return res.status(500).json({ message: errorMessage });
    }
};
