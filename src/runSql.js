const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

(async () => {
    try {
        const initClient = new Client({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT || 5432,
        });

        await initClient.connect();
        console.log('Connected to PostgreSQL.');

        const dbName = process.env.DB_NAME;
        const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`;
        const dbExists = await initClient.query(checkDbQuery);

        if (dbExists.rowCount === 0) {
            console.log(`Database "${dbName}" does not exist. Creating...`);
            await initClient.query(`CREATE DATABASE ${dbName}`);
            console.log(`Database "${dbName}" created successfully.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }

        await initClient.end();

        const client = new Client({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: dbName,
            port: process.env.DB_PORT || 5432,
        });

        await client.connect();
        console.log(`Connected to database "${dbName}".`);

        const sqlPath = path.resolve(__dirname, 'db', 'init.sql'); // Adjust to your file location
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        await client.query(sql);
        console.log('SQL script executed successfully.');

        await client.end();
        console.log('Disconnected from the database.');
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
