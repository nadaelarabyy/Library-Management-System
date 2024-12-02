-- Create the database
CREATE DATABASE library_db;

-- Create table for books
CREATE TABLE book (
    book_id SERIAL PRIMARY KEY, 
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    quantity INT DEFAULT 1,
    shelf_location VARCHAR(50)
);

-- Create table for borrowers
CREATE TABLE borrower (
    borrower_id SERIAL PRIMARY KEY, 
    borrower_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, 
    registered_date DATE
);

-- Create table for borrowing process
CREATE TABLE borrowing_process (
    borrowing_id SERIAL PRIMARY KEY,
    book_id INT, 
    borrower_id INT, 
    checkout_date DATE,
    return_date DATE,
    due_date DATE,
    CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES book(book_id) ON DELETE CASCADE,
    CONSTRAINT fk_borrower FOREIGN KEY (borrower_id) REFERENCES borrower(borrower_id) ON DELETE CASCADE
);

--  -------------------------------------insertion examples-------------------------------
-- insertion into books
INSERT INTO book (title, author, isbn, quantity, shelf_location)
VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 5, 'A1'),
('1984', 'George Orwell', '9780451524935', 3, 'B2'),
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 4, 'C3'),
('Pride and Prejudice', 'Jane Austen', '9780141040349', 2, 'D4'),
('Moby-Dick', 'Herman Melville', '9780142437247', 6, 'E5'),
('War and Peace', 'Leo Tolstoy', '9781400079988', 3, 'F6'),
('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 7, 'G7'),
('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 5, 'H8'),
('Brave New World', 'Aldous Huxley', '9780060850524', 4, 'I9'),
('Animal Farm', 'George Orwell', '9780451526342', 2, 'J10');
-- insertion into borrowers
INSERT INTO borrower (borrower_name, email, registered_date)
VALUES
('Alice Johnson', 'alice.johnson@example.com', '2024-01-15'),
('Bob Smith', 'bob.smith@example.com', '2024-02-20'),
('Charlie Brown', 'charlie.brown@example.com', '2024-03-05'),
('David Williams', 'david.williams@example.com', '2024-04-10'),
('Emily Davis', 'emily.davis@example.com', '2024-05-02'),
('Franklin Lee', 'franklin.lee@example.com', '2024-06-15'),
('Grace Parker', 'grace.parker@example.com', '2024-07-20'),
('Helen Walker', 'helen.walker@example.com', '2024-08-22'),
('Irene Adams', 'irene.adams@example.com', '2024-09-17'),
('James King', 'james.king@example.com', '2024-10-01');
-- borrowing process
INSERT INTO borrowing_process (book_id, borrower_id, checkout_date, due_date)
VALUES
(1, 1, '2024-11-01', '2024-11-15'),  -- Alice borrows "The Great Gatsby"
(2, 2, '2024-11-05', '2024-11-19'),  -- Bob borrows "1984"
(3, 3, '2024-11-10', '2024-11-24'),  -- Charlie borrows "To Kill a Mockingbird"
(4, 4, '2024-11-12', '2024-11-26'),  -- David borrows "Pride and Prejudice"
(5, 5, '2024-11-15', '2024-11-29'),  -- Emily borrows "Moby-Dick"
(6, 6, '2024-11-17', '2024-12-01'),  -- Franklin borrows "War and Peace"
(7, 7, '2024-11-18', '2024-12-02'),  -- Grace borrows "The Catcher in the Rye"
(8, 8, '2024-11-20', '2024-12-04'),  -- Helen borrows "The Hobbit"
(9, 9, '2024-11-21', '2024-12-05'),  -- Irene borrows "Brave New World"
(10, 10, '2024-11-25', '2024-12-09'); -- James borrows "Animal Farm"

-- Add an index on the 'title' column in the books table for fast searches
CREATE INDEX idx_books_title ON books (title);

-- Add an index on the 'author' column in the books table
CREATE INDEX idx_books_author ON books (author);

-- Add an index on the 'isbn' column in the books table
CREATE INDEX idx_books_isbn ON books (isbn);

-- Add an index on the 'name' column in the borrowers table
CREATE INDEX idx_borrowers_name ON borrower (borrower_name);