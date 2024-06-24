import express from 'express';
import cors from 'cors';
import authRoute from "./routes/authRoute.js";
import bodyParser from 'body-parser';
import {initializeApp} from "firebase/app";
import dotenv from "dotenv";

dotenv.config();


const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGE_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

const port = process.env.PORT;
const app = express();
const firebaseApp = initializeApp(firebaseConfig);



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.use("/auth",authRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});