// validationError.mjs
import { CustomError } from './CustomError.mjs';

class ValidationError extends CustomError {
    constructor(message = "Validation Error") {
        super(400, message);
    }
}

export { ValidationError }; // named export



