const jwt = require('jsonwebtoken');


const payload = {
    userId: "testId",
    email: "test@email.com",
    exp: Math.floor(Date.now() / 1000) + 3600  // Expires in 1 hour
};

const JWT_SECRET_KEY = 'your_jwt_secret'; // Replace this with your JWT secret

jwt.sign(payload, JWT_SECRET_KEY, (err, token) => {
    if (err) {
        console.error(`Error in JWT signing: ${err.message}`);
    } else {
        console.log(`Generated Token: ${token}`);
    }
});

