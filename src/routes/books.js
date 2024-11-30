const express = require('express');
const Book = require('../models/book');
const router = express.Router();

// Add a book
router.post('/', async (req, res) => {
    try {
        const { title, author, isbn, quantity, shelfLocation } = req.body;
        const book = await Book.create({ title, author, isbn, quantity, shelfLocation });
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// List all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search books by title, author, or ISBN
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const books = await Book.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { title: { [Sequelize.Op.iLike]: `%${query}%` } },
                    { author: { [Sequelize.Op.iLike]: `%${query}%` } },
                    { isbn: { [Sequelize.Op.iLike]: `%${query}%` } },
                ],
            },
        });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
