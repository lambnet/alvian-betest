import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/main.js';

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to db'))
    .catch((err) => console.log(err))

const app = express();
app.use(express.json());
app.use('/api/v1', router);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${process.env.PORT}`)
})