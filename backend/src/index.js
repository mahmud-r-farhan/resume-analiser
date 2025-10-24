require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const analysisRoutes = require('./routes/analysisRoutes');

dotenv.config();
const app = express();

connectDB();  // Optional

app.use(cors());
app.use(express.json());
app.use('/api', analysisRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));