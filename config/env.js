import { config } from 'dotenv';
config({ path: `.env.development.local` });

export const { 
    PORT, 
    NODE_ENV, 
    MONGODB_URI, 
    JWT_SECRET, 
    JWT_EXPIRES_IN,
    ARCJET_ENV,
    ARCJET_KEY, 
    QSTASH_TOKEN,
    QSTASH_URL,
    EMAIL_PASSWORD,
    SERVER_URL: ENV_SERVER_URL // read SERVER_URL from .env
} = process.env;

export const SERVER_URL = ENV_SERVER_URL || `http://localhost:${PORT}`;

