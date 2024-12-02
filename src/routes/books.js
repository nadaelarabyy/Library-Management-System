const express = require('express');
const Book = require('../models/book');
const router = express.Router();
const Sequelize = require("sequelize");
// caching using redis
const { promisify } = require('util');
const redis = require('redis');
const client = redis.createClient({
    host: 'localhost',  // Redis server host (ensure it's correct)
    port: 6379,         // Redis server port (default is 6379)
});
client.get = promisify(client.get);  // Promisify the Redis `get` method
client.setex = promisify(client.setEx);
// Handle connection events for Redis
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.log('Error connecting to Redis:', err);
});


const getBooksFromCache = async (cacheKey) => {
    try {
        const cachedResult = await client.get(cacheKey);  // Fetch cached data
        if (cachedResult) {
            return JSON.parse(cachedResult);  // Return cached result if it exists
        }
        return null;  // Return null if cache is empty
    } catch (err) {
        console.error('Redis GET error:', err);
        return null;  // Return null on error
    }
};

// Function to set cache
const setBooksToCache = async (cacheKey, books) => {
    try {
        await client.setEx(cacheKey, 60, JSON.stringify(books));  // Cache with TTL (60 seconds)
    } catch (err) {
        console.error('Redis SETEX error:', err);
    }
}

// Add a book
router.post('/', async (req, res) => {
    try {
        const { title, author, isbn, quantity, shelf_location } = req.body;
        const book = await Book.create({ 
            title, 
            author, 
            isbn, 
            quantity, 
            shelf_location,
            createdAt: Date.now(),  
            updatedAt: Date.now(),
        });
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// List all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.findAll(
            {
                attributes: ['book_id', 'title', 'author','isbn', 'quantity', 'shelf_location'],
                limit: 100,  // Limit results for pagination
            }
        );
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search books by title, author, or ISBN
router.get('/search', async (req, res) => {
    try {
        // Destructure the query parameters directly from req.query
        const { title, author, isbn } = req.query;

        const cacheKey = `search:${title || ''}:${author || ''}:${isbn || ''}`;
        console.log("Cache key: ",cacheKey);
        // Try to get data from cache
        const cachedResult = await getBooksFromCache(cacheKey);
        if (cachedResult) {
            return res.status(200).json(cachedResult);  // Return cached data
        }

        const whereConditions = {};

        if (title) {
            whereConditions.title = { [Sequelize.Op.iLike]: `%${title}%` };
        }

        if (author) {
            whereConditions.author = { [Sequelize.Op.iLike]: `%${author}%` };
        }

        if (isbn) {
            whereConditions.isbn = { [Sequelize.Op.iLike]: `%${isbn}%` };
        }

        // Fetch books from the database
        const books = await Book.findAll({
            attributes: ['book_id', 'title', 'author', 'isbn', 'quantity', 'shelf_location'],
            where: whereConditions, 
            limit: 100,  // Limit results for pagination
        });

        // Cache the result
        await setBooksToCache(cacheKey, books);


        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a book's details
    router.put('/:book_id', async (req, res) => {
        try {
            const { book_id } = req.params;  // Extract book_id from URL parameter
            const { title, author, isbn, quantity, shelf_location } = req.body;  // Extract the new book details from the request body
            // Find the book by its ID
            const book = await Book.findByPk(Number(book_id));

            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }

            // Update the book's details
            const updatedBook = await book.update({
                title,
                author,
                isbn,
                quantity,
                shelf_location
            });

            res.status(200).json(updatedBook);  // Respond with the updated book details
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Delete a book
    router.delete('/:book_id', async (req, res) => {
        try {
            const { book_id } = req.params;  // Extract book_id from URL parameter

            // Find the book by its ID
            const book = await Book.findByPk(Number(book_id));

            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }

            // Delete the book
            await book.destroy();

            res.status(200).json({ message: 'Book deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });


module.exports = router;
