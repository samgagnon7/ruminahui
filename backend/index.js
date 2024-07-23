const express = require('express');
const cors = require('cors');
const imageRoutes = require('./routes/imageRoutes');


const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/image', imageRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
