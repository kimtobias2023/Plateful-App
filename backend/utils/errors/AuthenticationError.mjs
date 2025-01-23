// authenticationError.mjs
import { CustomError } from './CustomError.mjs';

class AuthenticationError extends CustomError {
    constructor(message = "Authentication Error") {
        super(401, message);
    }
}

export { AuthenticationError }; // named export



