
# Library API

This is a RESTful API built with Express and Sequelize to manage a library system. It handles books, borrowers, and borrowing processes. Basic authentication is implemented for secure access.

## Features
- Book management
- Borrower management
- Borrowing process
- Basic Authentication

## Prerequisites
- Node.js
- PostgreSQL
- Redis

## Setup

1. Clone the repository.
2. Install dependencies:  
   `npm install`
3. Configure your `.env` file with the following values:
   ```env
   DB_HOST=127.0.0.1
   DB_NAME=library_db
   DB_USER=postgres
   DB_PASS=bosta2024
   DB_PORT=5432
   NAME=admin
   PASSWORD=password123
   ```

4. To initialize the database:
   - SQL initialization script (`init.sql`) in the `db` folder.
   - Run the following Node.js script to create the database and execute the SQL script:

   ```bash
   node src/runSql.js
   ```

5. Start the services using Docker Compose:
   ```bash
   docker-compose up
   ```

6. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/books`: Create a new book.
- `GET /api/books`: List all books.
- `POST /api/borrowers`: Add a new borrower.
- `GET /api/borrowers`: List all borrowers.
- `POST /api/borrow`: Borrow a book.

## Authentication
- Use basic authentication:  
   **Username**: `admin`  
   **Password**: `password123`

## Technologies Used
- Express
- Sequelize (ORM for PostgreSQL)
- PostgreSQL
- Redis
- Docker
