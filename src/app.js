const express = require('express');
const sequelize = require('./config/database');
const Book = require('./models/book');
const bookRoutes = require('./routes/books');

const app = express();
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);

// Sync Database
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced...');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
