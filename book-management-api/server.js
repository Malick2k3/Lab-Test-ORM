require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const bookRoutes = require('./routes/books');

const app = express();
app.use(cors());
app.use(express.json());

// Test the database connection
sequelize.authenticate()
    .then(() => console.log('Database connected.'))
    .catch(err => console.error('Database connection error:', err));

// Sync the model with the database
sequelize.sync({ alter: true })  
    .then(() => console.log('Database synced.'))
    .catch(err => console.error('Database sync error:', err));

// Routes
app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
