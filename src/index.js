import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to db'))
    .catch((err) => console.log(err))

const app = express();
app.use(express.json());


app.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${process.env.PORT}`)
})
