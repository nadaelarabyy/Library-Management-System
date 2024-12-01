const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Book = require('./book');

// Borrow Model
const Borrow = sequelize.define('Borrow', {
    borrow_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    borrower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'borrower', 
            key: 'borrower_id',
        },
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'book', 
            key: 'book_id',
        },
    },
    borrow_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'borrow',
    timestamps: false, 
});


module.exports = Borrow;
