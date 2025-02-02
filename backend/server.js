import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

// Load environment variables from .env file
dotenv.config();
const port = process.env.PORT || 5000;  // Fallback to 5000 if PORT is undefined

const app = express();
app.use(express.json());
app.use(cors());

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Define routes
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);

        // Connect to MongoDB using URI from .env
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);  // Exit process if connection fails
    }
};

// Start server after connecting to the database
connectDB().then(() => {
    app.listen(port, () => console.log(`Listening on port ${port}`));
}).catch(err => console.log('Error during initial connection:', err));

export { app };