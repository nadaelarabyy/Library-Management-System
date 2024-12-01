const express = require('express');
const Borrow = require('../models/borrow');
const Book = require('../models/book');
const Borrower = require('../models/borrower');
const router = express.Router();
const Sequelize = require('sequelize');

// Borrow a book
router.post('/borrow', async (req, res) => {
    try {
        const { borrower_id, book_id, due_date } = req.body;

        // Check if the book is available
        const book = await Book.findByPk(book_id);
        if (!book || book.quantity <= 0) {
            return res.status(400).json({ error: 'Book not available' });
        }

        // Create a borrow record
        const borrow = await Borrow.create({
            borrower_id,
            book_id,
            borrow_date: new Date(),
            due_date,
        });

        // Decrease the book's quantity
        await book.update({ quantity: book.quantity - 1 });

        res.status(201).json(borrow);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Return a book
router.put('/return', async (req, res) => {
    try {
        const { borrow_id } = req.body;

        // Find the borrow record
        const borrow = await Borrow.findByPk(borrow_id);
        if (!borrow || borrow.return_date) {
            return res.status(400).json({ error: 'Invalid borrow record or book already returned' });
        }

        // Update the return date
        await borrow.update({ return_date: new Date() });

        // Increase the book's quantity
        const book = await Book.findByPk(borrow.book_id);
        await book.update({ quantity: book.quantity + 1 });

        res.status(200).json({ message: 'Book returned successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List books currently borrowed by a borrower
router.get('/borrowed/:borrower_id', async (req, res) => {
    try {
        const { borrower_id } = req.params;

        const borrowedBooks = await Borrow.findAll({
            where: {
                borrower_id,
                return_date: null, // Only books that haven't been returned
            },
            include: [
                {
                    model: Book,
                    attributes: ['title', 'author', 'isbn'],
                },
            ],
        });

        res.status(200).json(borrowedBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List overdue books
router.get('/overdue', async (req, res) => {
    try {
        const overdueBooks = await Borrow.findAll({
            where: {
                return_date: null, // Not returned
                due_date: { [Sequelize.Op.lt]: new Date() }, // Past the due date
            },
            include: [
                {
                    model: Book,
                    attributes: ['title', 'author', 'isbn'],
                },
                {
                    model: Borrower,
                    attributes: ['borrower_name', 'email'],
                },
            ],
        });

        res.status(200).json(overdueBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
