import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();


const env = process.env.NODE_ENV || 'development';

const databaseConfig = {
    development: {
        database: process.env.DEV_DB_NAME,
        username: process.env.DEV_DB_USER,
        password: String(process.env.DEV_DB_PASSWORD),
        host: 'localhost',
        dialect: 'postgres',
        logging: console.log
    },
    test: {
        database: process.env.TEST_DB_NAME,
        username: process.env.TEST_DB_USER,
        password: String(process.env.TEST_DB_PASSWORD),
        host: 'localhost',
        dialect: 'postgres',
        logging: console.log
    },
    production: {
        database: process.env.PROD_DB_NAME,
        username: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASSWORD,
        host: process.env.PROD_DB_HOST,
        dialect: 'postgres',
        logging: false
    },
};

console.log('Current NODE_ENV:', process.env.NODE_ENV);
console.log('Database User:', process.env.DEV_DB_USER);

const sequelize = new Sequelize({
    ...databaseConfig[env],
});

const connectSequelize = async () => {
    try {
        await sequelize.authenticate();
        console.log('Successfully connected to Sequelize.');
    } catch (error) {
        console.error('Unable to connect to the Sequelize database:', error);
        throw error; // Re-throw the error so that it can be caught in Promise.all
    }
};


// Named export for connectSequelize
export { connectSequelize };

// Default export remains as sequelize
export default sequelize;











