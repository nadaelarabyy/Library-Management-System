const express = require('express');
const Book = require('../models/book');
const router = express.Router();
const Sequelize = require("sequelize");


// Add a book
router.post('/', async (req, res) => {
    try {
        console.log(req.body)
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
                attributes: ['book_id', 'title', 'author','isbn', 'quantity', 'shelf_location']
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
        });

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a book's details
router.put('/:book_id', async (req, res) => {
    try {
        const { book_id } = req.params;  // Extract book_id from URL parameter
        const { title, author, isbn, quantity, shelfLocation } = req.body;  // Extract the new book details from the request body

        // Find the book by its ID
        const book = await Book.findByPk(book_id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Update the book's details
        const updatedBook = await book.update({
            title,
            author,
            isbn,
            quantity,
            shelf_location: shelfLocation,
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
        const book = await Book.findByPk(book_id);

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
