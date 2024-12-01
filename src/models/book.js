const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Borrow = require('./borrow');

const Book = sequelize.define('Book', {
    book_id: {  
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isbn: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    shelf_location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
},
{
    tableName: 'book',
    timestamps: false
});

// Define relationships
Book.hasMany(Borrow, { foreignKey: 'book_id' }); // A book can have many borrow records
Borrow.belongsTo(Book, { foreignKey: 'book_id' }); // A borrow record belongs to a book

module.exports = Book;
