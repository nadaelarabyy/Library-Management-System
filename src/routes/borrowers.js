const express = require('express');
const Borrower = require('../models/borrower'); 
const router = express.Router();
const Sequelize = require("sequelize");

// Register a borrower
router.post('/', async (req, res) => {
    try {
        const { borrower_name, email, registered_date } = req.body;

        // Create a new borrower
        const borrower = await Borrower.create({
            borrower_name,
            email,
            registered_date: registered_date || new Date(), 
        });

        res.status(201).json(borrower);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// List all borrowers
router.get('/', async (req, res) => {
    try {
        const borrowers = await Borrower.findAll({
            attributes: ['borrower_id', 'borrower_name', 'email', 'registered_date']
        });

        res.status(200).json(borrowers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update borrower's details
router.put('/:borrower_id', async (req, res) => {
    try {
        const { borrower_id } = req.params; 
        const { borrower_name, email, registered_date } = req.body; 

        // Find the borrower by ID
        const borrower = await Borrower.findByPk(borrower_id);

        if (!borrower) {
            return res.status(404).json({ error: 'Borrower not found' });
        }

        // Update borrower's details
        const updatedBorrower = await borrower.update({
            borrower_name,
            email,
            registered_date,
        });

        res.status(200).json(updatedBorrower); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a borrower
router.delete('/:borrower_id', async (req, res) => {
    try {
        const { borrower_id } = req.params; 

        // Find the borrower by ID
        const borrower = await Borrower.findByPk(borrower_id);

        if (!borrower) {
            return res.status(404).json({ error: 'Borrower not found' });
        }

        // Delete the borrower
        await borrower.destroy();

        res.status(200).json({ message: 'Borrower deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
