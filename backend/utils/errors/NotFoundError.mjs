// notFoundError.mjs
import { CustomError } from './CustomError.mjs';

class NotFoundError extends CustomError {
    constructor(message = "Not Found") {
        super(404, message);
    }
}

export { NotFoundError }; // named export



