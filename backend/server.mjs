// Core libraries
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

// Own module imports
import { logger } from './utils/logger.mjs';
import { connectSequelize } from './config/sequelize-instance.mjs';
import { setupAssociations } from './models/sequelize/associations.mjs';
import cleanupExpiredTokens from './utils/tokenCleanup.mjs';
import { verifyLoginLinkController } from './controllers/auth/index.mjs';
import { errorMiddleware } from './middleware/index.mjs';
import csurf from 'csurf';

import {
    audioRoutes,
    authRoutes,
    profileRoutes,
    socialRoutes,
    groceryRoutes,
    labelRoutes,
    menuRoutes,
    notificationRoutes,
    recipeRoutes,
    unitRoutes,
    subscriptionRoutes,
    mediaRoutes
} from './routes/index.mjs';

// Third-party libraries
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Initialize environment variables
dotenv.config();

// Constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const app = express();

mongoose.set('strictQuery', true);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/session', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Successfully connected to MongoDB.");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

const sessionStore = new MongoStore({
    client: mongoose.connection.getClient(),
});

// Parse CORS origins from .env
const corsOrigins = process.env.CORS_ORIGINS.split(',');

// CORS Middleware: Allows specific origins and headers
const corsOptions = {
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-csrf-token'],
    allowedHeaders: ['Content-Type', 'Authorization', '_csrf', 'x-csrf-token']
};
app.use(cors(corsOptions));


app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware to log the received CSRF token
app.use((req, res, next) => {
    const receivedToken = req.headers['x-csrf-token'] || req.body._csrf;
    console.log(`Received CSRF token for ${req.method} to ${req.url}:`, receivedToken);
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,  // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    }
}));

// Health check route (minimal dependencies)
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const csrfProtection = csurf({ session: true }); 

// Set up the csurf middleware after the session
app.use(csrfProtection);

app.get('/login', (req, res) => {
    const csrfToken = req.csrfToken();
    console.log("Server-side CSRF token:", csrfToken);
    res.json({ csrfToken });
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
    next();
});

// Routes
app.get('/verify-login/:token', verifyLoginLinkController);

// Define the /error route
app.get('/error', (req, res) => {
    const reason = req.query.reason;
    // Handle the error reason and send a response.
    // For now, let's just send the reason as a response.
    res.status(400).send(`Error occurred due to: ${reason}`);
});

// Integrating the routes
app.use('/audio', audioRoutes); // This is how you register the audio processing routes
app.use('/social', socialRoutes);
app.use('/grocery', groceryRoutes);
app.use('/label', labelRoutes);
app.use('/menu', menuRoutes);
app.use('/notification', notificationRoutes);
app.use('/recipe', recipeRoutes);
app.use('/unit', unitRoutes);

// User Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/media', mediaRoutes);  // This now contains the video upload route
app.use('/subscription', subscriptionRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        console.error('Invalid CSRF token received:', req.headers['x-csrf-token']);
        res.status(403).json({ error: 'Invalid CSRF token' });
    } else {
        console.error(`Error occurred: ${err.message}`);
        if (process.env.NODE_ENV === 'development') {
            console.error(err.stack);
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error handling
app.use(errorMiddleware);

const startServerAndDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/session', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Successfully connected to MongoDB.');

        console.log('Connecting to PostgreSQL...');
        await connectSequelize();
        console.log('Successfully connected to PostgreSQL');

        setupAssociations();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

startServerAndDatabase();

export default app;


