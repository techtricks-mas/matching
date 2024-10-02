import 'dotenv/config'
import express  from 'express';
import cors  from 'cors';
import dbConnect from './src/db/connect.js';
import route from './src/routes/index.js';

const urlencoded = express.urlencoded;
const app = express();
// dbConnect();
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(route);

app.listen(process.env.PORT, () => {
   console.log(`App is running on port: ${process.env.PORT}`);
});
