const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Ensure a default JWT secret exists in development to avoid silent failures
if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET not set in environment — using development fallback.');
    process.env.JWT_SECRET = 'betterme_dev_secret';
}

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
const db = process.env.MONGODB_URI;
mongoose.connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/routines', require('./routes/routines'));
app.use('/api/stats', require('./routes/stats'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
