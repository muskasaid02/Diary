import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import postRoutes from './routes/posts.js';

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//     res.json({ msg: 'backend server running'})
// });

app.use('/api/posts', postRoutes);


const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);

        mongoose.connect(process.env.MONGO_URI, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true
            //(both are giving warnings, explore warning later)
        });

        console.log('MongoDB is connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1); 
    }
}

connectDB().then( () => {
    app.listen(port, () => console.log(`Listening on port ${port}`));
}).catch(err => console.log(err));

// app.listen(4000, () => console.log('Listening on port 4000'));

