const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/books');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ShelfTrack API',
  });
});

app.use('/api/books', bookRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
