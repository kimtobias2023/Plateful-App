import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import zxcvbn from 'zxcvbn';
import { registerService } from './../../services/sequelize/auth/registerService.mjs';
import { ValidationError } from './../../utils/errors/ValidationError.mjs';
import { AuthenticationError } from './../../utils/errors/AuthenticationError.mjs';


const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10; // Configurable salt rounds

function validateInput(body) {
    console.log('Received Data:', body);

    body.birthday = formatDate(body.birthday);

    const {
        firstName,
        lastName,
        email,
        password
    } = body;

    if (!firstName || !lastName || !email || !password ) {
        return { error: 'All required fields must be provided.', data: null };
    }

    const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!EMAIL_REGEX.test(email)) {
        return { error: 'Invalid email format.', data: null };
    }

    // Return validated fields if all checks pass
    return {
        error: null,
        data: {
            firstName,
            lastName,
            email,
            password
        },
    };
}

async function registerController(req, res, next) {
    try {
        // Log the incoming request body
        console.log('RegisterController: Received request body:', req.body);

        const { error, data } = validateInput(req.body);
        if (error) {
            console.error('RegisterController: Input validation error:', error);
            throw new ValidationError(error);
        }

        // Log the sanitized input data before passing to the service
        console.log('RegisterController: Validated input data:', data);

        const userWithoutPassword = await registerService(data);

        if (!userWithoutPassword) {
            console.error('RegisterController: User service returned no data.');
            throw new Error('User information is missing.');
        }

        // Log the successful user object
        console.log('RegisterController: User created successfully:', userWithoutPassword);

        res.status(200).json({
            message: 'Registration successful. Verification email sent.',
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('RegisterController: Error occurred:', {
            message: error.message,
            stack: error.stack,
        });

        const statusCode = error.statusCode || 500;

        // Log the response being sent to the client
        const errorResponse = {
            success: false,
            message: error.message || 'Internal server error.',
        };
        console.error('RegisterController: Sending error response:', errorResponse);

        res.status(statusCode).json(errorResponse);
    }
}

function validatePassword(password) {
    const result = zxcvbn(password);

    if (password.length < 8) {
        throw new ValidationError('Password is too short.');
    }

    if (password.length > 1000) {
        throw new ValidationError('Password is too long.');
    }

    if (!validatePasswordStrength(password)) {
        const suggestions = result.feedback.suggestions.join(', ') || 'Use a stronger password.';
        throw new ValidationError(`Password does not meet strength requirements. Suggestions: ${suggestions}`);
    }
}

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.error('Error hashing password:', error.message);
        throw new Error('Failed to hash password.');
    }
}

function generateTokenForUser(user) {
    try {
        const payload = {
            userId: user.id,
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1-hour expiry
        };
        return jwt.sign(payload, process.env.JWT_SECRET_KEY);
    } catch (err) {
        console.error('JWT Error:', err.message);
        throw new AuthenticationError('Unexpected JWT signing error.');
    }
}

export {
    validateInput,
    registerController,
    validatePassword,
    hashPassword,
    generateTokenForUser,
};

