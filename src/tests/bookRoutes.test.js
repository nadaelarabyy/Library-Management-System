const request = require('supertest');
const express = require('express');
const bookRoutes = require('../routes/books');
const Book = require('../models/book');
const Sequelize = require('sequelize'); // Import Sequelize for Op.iLike


// Mock Sequelize Model
jest.mock('../models/book');

const app = express();
app.use(express.json());
app.use('/books', bookRoutes);

describe('Book Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear previous mocks before each test
    });
    // testing endpoints for listing all books

    test('GET /books - should return a list of books', async () => {
        // Mock the Sequelize response
        Book.findAll.mockResolvedValue([
            { book_id: 1, title: 'Book 1', author: 'Author 1', isbn: '12345', quantity: 10, shelf_location: 'A1' },
            { book_id: 2, title: 'Book 2', author: 'Author 2', isbn: '67890', quantity: 5, shelf_location: 'B2' },
        ]);

        // Await the response from the API call
        const response = await request(app).get('/books');

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { book_id: 1, title: 'Book 1', author: 'Author 1', isbn: '12345', quantity: 10, shelf_location: 'A1' },
            { book_id: 2, title: 'Book 2', author: 'Author 2', isbn: '67890', quantity: 5, shelf_location: 'B2' },
        ]);
        expect(Book.findAll).toHaveBeenCalledTimes(1); // Ensure `findAll` was called
    });

    test('GET /books - should handle errors', async () => {
        // Mock Sequelize to throw an error
        Book.findAll.mockRejectedValue(new Error('Database error'));

        // Await the response from the API call
        const response = await request(app).get('/books');

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Database error' });
        expect(Book.findAll).toHaveBeenCalledTimes(1);
    });
    // testing endpoints for adding a book
    test('POST /books - should create a new book', async () => {
        // Mock the Sequelize response for book creation
        const newBook = { 
            book_id: 1, 
            title: 'New Book', 
            author: 'Author Name', 
            isbn: '123456789', 
            quantity: 5, 
            shelf_location: 'A1',
            createdAt: 1733089916408, // Mocked value for createdAt
            updatedAt: 1733089916408  // Mocked value for updatedAt
        };
    
        Book.create.mockResolvedValue(newBook);
    
        const response = await request(app).post('/books').send({
            title: 'New Book',
            author: 'Author Name',
            isbn: '123456789',
            quantity: 5,
            shelf_location: 'A1',
        });
    
        // Assertions
        expect(response.status).toBe(201);
        
        expect(response.body).toMatchObject({
            book_id: 1, 
            title: 'New Book', 
            author: 'Author Name', 
            isbn: '123456789', 
            quantity: 5, 
            shelf_location: 'A1',
        });
    
        expect(Book.create).toHaveBeenCalledTimes(1);
        expect(Book.create).toHaveBeenCalledWith(expect.objectContaining({
            title: 'New Book',
            author: 'Author Name',
            isbn: '123456789',
            quantity: 5,
            shelf_location: 'A1',
        }));
    });
    // testing endpoint for update a book
    

    // Update Book - Book Not Found Case
    test('PUT /books/:id - should return 404 if book not found', async () => {
        // Mock `findByPk` to return null (book not found)
        Book.findByPk.mockResolvedValue(null);

        const response = await request(app)
            .put('/books/1') // Attempting to update book with ID 1
            .send({
                title: 'Updated Book',
                author: 'Updated Author',
                isbn: '987654321',
                quantity: 10,
                shelf_location: 'B1',
            });

        // Assertions
        expect(response.status).toBe(404); // Should return status 404 (Not Found)
        expect(response.body).toEqual({ error: 'Book not found' }); // Error message for book not found
        expect(Book.findByPk).toHaveBeenCalledWith(1); // Ensure `findByPk` was called with ID 1
    });

    // Delete Book - Book Not Found
    test('DELETE /books/:id - should return 404 if book not found', async () => {
        // Mock `findByPk` to return null (book not found)
        Book.findByPk.mockResolvedValue(null);

        const response = await request(app).delete('/books/1');

        // Assertions
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Book not found' });
        expect(Book.findByPk).toHaveBeenCalledWith(1); // Ensure `findByPk` was called with ID 1
    });
    // search endpoint
    test('GET /books/search - should return books matching search criteria', async () => {
        const mockBooks = [
            { book_id: 1, title: 'Book 1', author: 'Author 1', isbn: '12345', quantity: 10, shelf_location: 'A1' },
            { book_id: 2, title: 'Book 2', author: 'Author 2', isbn: '67890', quantity: 5, shelf_location: 'B2' }
        ];

        // Mock the Sequelize `findAll` method to return the mockBooks
        Book.findAll.mockResolvedValue(mockBooks);

        // Make a request with search parameters (search by title)
        const response = await request(app).get('/books/search').query({ title: 'Book' });

        // Assertions
        expect(response.status).toBe(200); // Should return status 200 (OK)
        expect(response.body).toEqual(mockBooks); // Ensure the correct books are returned

        // Ensure `findAll` was called with the correct query
        expect(Book.findAll).toHaveBeenCalledWith(expect.objectContaining({
            attributes: ['book_id', 'title', 'author', 'isbn', 'quantity', 'shelf_location'],
            where: expect.objectContaining({
                title: { [Sequelize.Op.iLike]: '%Book%' }  // Match the Op.iLike operator used in Sequelize
            })
        }));
    });
});

