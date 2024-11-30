-- init.sql
CREATE DATABASE library_db;


CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    quantity INT DEFAULT 1,
    shelf_location VARCHAR(50)
);
