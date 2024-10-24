import express from 'express';
import cors from 'cors';
import {imageRoutes} from './routes/imageRoutes.js';

const app = express();
const port = 5001;

// Middleware
app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use('/image', imageRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://192.168.2.34:${port}`);
});
