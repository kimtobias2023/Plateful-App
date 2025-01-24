import jwt from 'jsonwebtoken';

const permissionsMiddleware = (req, res, next) => {
    try {
        // Destructure cookies and headers from request object
        const { cookies, headers } = req;

        // Extract JWT from either a cookie or the Authorization header
        const { jwt: tokenFromCookie } = cookies;
        const tokenFromHeader = headers.authorization && headers.authorization.split(' ')[1];
        const token = tokenFromCookie || tokenFromHeader;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Logging the token only if in development environment
        if (process.env.NODE_ENV === 'development') {
            console.log(`Token: ${token}`);
        }
        if (!token) {
            console.error('Token is missing!');
            return res.status(401).json({ error: 'No token provided.' });
        }

        // Verify and decode the JWT
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Logging the decoded token only if in development environment
        if (process.env.NODE_ENV === 'development') {
            console.log(`Decoded Token: ${JSON.stringify(decodedToken)}`);
        }

        // Check if the user is an admin
        if (!decodedToken.isAdmin) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // If the user is an admin, pass control to the next middleware
        next();
    } catch (error) {
        // If there is an error while verifying or decoding the JWT, return an error response
        console.error(`JWT error: ${error.message}`);

        if (error.message === 'jwt expired') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        if (error.message === 'invalid signature') {
            return res.status(401).json({ error: 'Token signature is invalid' });
        }
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

export { permissionsMiddleware };




  
