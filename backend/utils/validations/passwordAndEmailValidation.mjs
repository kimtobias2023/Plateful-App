import { ValidationError } from '../errors/index.mjs';


// Validate the format of an email address
const validateEmail = (email) => {
    // Use a regular expression to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePasswordStrength = (password) => {
    // Check for minimum length
    if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters long.');
    }

    // Check for at least one uppercase character
    if (!/[A-Z]/.test(password)) {
        throw new ValidationError('Password must contain at least one uppercase letter.');
    }

    // Check for at least one lowercase character
    if (!/[a-z]/.test(password)) {
        throw new ValidationError('Password must contain at least one lowercase letter.');
    }

    // Check for at least one digit
    if (!/\d/.test(password)) {
        throw new ValidationError('Password must contain at least one number.');
    }

    // Check for at least one special character
    if (!/[!@#$%^&*]/.test(password)) {
        throw new ValidationError('Password must contain at least one of the special characters: !@#$%^&*');
    }

    // Ensure there are no spaces
    if (/\s/.test(password)) {
        throw new ValidationError('Password should not contain spaces.');
    }

    // If all checks pass, password is considered strong
    return true;
};

// Export the validation functions
export { validateEmail, validatePasswordStrength };

  