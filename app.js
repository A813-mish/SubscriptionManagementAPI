import express from 'express';
import cookieParser from 'cookie-parser';


import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js'
import workflowRouter from './routes/workflow.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Hello from Subscription Tracker API');
});

const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Subscription Tracker API is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
    }
};

startServer();

export default app;
