import express from 'express';
import cors from 'cors';
import authRoute from "./routes/auth.route.js";
import dbRoute from "./routes/db.route.js";
import geminiRoute from "./routes/gemini.route.js";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT;
const app = express();




app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.use("/auth",authRoute);
app.use("/db",dbRoute);
app.use("/gemini",geminiRoute);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});