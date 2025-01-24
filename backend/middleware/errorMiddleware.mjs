import { CustomError } from '../utils/errors/index.mjs';

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
};

export { errorMiddleware };


  