const express = require('express');
const cors = require('cors');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

// CORS middleware'ini kullan
app.use(cors());

// JSON istek gövdelerini işlemek için
app.use(express.json());

// Quiz rotalarını kullan
app.use('/api/quizzes', quizRoutes);

module.exports = app;
