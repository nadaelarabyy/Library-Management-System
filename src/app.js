const express = require('express');
const sequelize = require('./config/database');
const bookRoutes = require('./routes/books');
const borrowerRoutes = require('./routes/borrowers');
const borrowRoutes = require('./routes/borrowingProcess');

const app = express();
app.use(express.json());

// Routes
app.use('/api', borrowRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrowers', borrowerRoutes);

// Sync Database
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced...');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
