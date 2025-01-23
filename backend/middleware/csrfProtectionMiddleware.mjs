import csurf from 'csurf';

// Configuration options for csurf
const csrfConfigOptions = {
    value: (req) => {
        return req.body._csrf || req.get('x-csrf-token'); // Check the body or the header for the CSRF token
    }
};

const csrfProtectionMiddleware = csurf(csrfConfigOptions);

export { csrfProtectionMiddleware };




