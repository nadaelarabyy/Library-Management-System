// middleware/authMiddleware.js
const auth = require('basic-auth');
require('dotenv').config();  // Load environment variables

// Fetch username and password from environment variables
const validCredentials = {
    username: process.env.NAME,   // Use credentials from environment variables
    password: process.env.PASSWORD,
};

// Basic Authentication middleware function
const basicAuth = (req, res, next) => {
    const credentials = auth(req); // Extract credentials using basic-auth

    if (!credentials || credentials.name !== validCredentials.username || credentials.pass !== validCredentials.password) {
        return res.status(401).json({ error: 'Unauthorized' });  // Return 401 if credentials are invalid
    }

    // Proceed to the next middleware or route handler if authentication succeeds
    next();
};

module.exports = basicAuth;
