const express = require('express');
const sequelize = require('./config/database');
const bookRoutes = require('./routes/books');
const borrowerRoutes = require('./routes/borrowers');
const borrowRoutes = require('./routes/borrowingProcess');
const basicAuth = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('api/books', require('./middleware/authMiddleware'));

// Routes
app.use('/api', basicAuth,borrowRoutes);
app.use('/api/books', basicAuth,bookRoutes);
app.use('/api/borrowers', basicAuth,borrowerRoutes);

// Sync Database
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced...');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
