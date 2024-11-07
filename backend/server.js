import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT;
const app = express();

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);

        mongoose.connect(process.env.MONGO_URI, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true
            //(both are giving warnings, explore warning later)
        })
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

app.get('/', (req, res) => {
    res.json({ msg: 'backend server running'})
});