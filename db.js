// server/db.js
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
    connectionString: 'your_database_connection_string_here'
});

const createTables = async () => {
    const client = await pool.connect();
    try {
        await client.query(`DROP TABLE IF EXISTS reservations;`);
        await client.query(`DROP TABLE IF EXISTS restaurants;`);
        await client.query(`DROP TABLE IF EXISTS customers;`);

        await client.query(`
            CREATE TABLE customers (
                id UUID PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `);
        
        await client.query(`
            CREATE TABLE restaurants (
                id UUID PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE reservations (
                id UUID PRIMARY KEY,
                date DATE NOT NULL,
                party_count INTEGER NOT NULL,
                restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
                customer_id UUID REFERENCES customers(id) NOT NULL
            );
        `);
    } finally {
        client.release();
    }
};

// Creating customers and restaurants
const createCustomer = async (name) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO customers (id, name) VALUES ($1, $2) RETURNING *',
            [uuidv4(), name]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

const createRestaurant = async (name) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO restaurants (id, name) VALUES ($1, $2) RETURNING *',
            [uuidv4(), name]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

const fetchCustomers = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM customers;');
        return result.rows;
    } finally {
        client.release();
    }
};

const fetchRestaurants = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM restaurants;');
        return result.rows;
    } finally {
        client.release();
    }
};

const fetchReservations = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT 
                r.id AS reservation_id,
                r.date,
                r.party_count,
                r.restaurant_id,
                r.customer_id,
                c.name AS customer_name,
                res.name AS restaurant_name
            FROM 
                reservations r
            JOIN 
                customers c ON r.customer_id = c.id
            JOIN 
                restaurants res ON r.restaurant_id = res.id;
        `);
        return result.rows;
    } finally {
        client.release();
    }
};

const createReservation = async (date, party_count, restaurant_id, customer_id) => {
    const client = await pool.connect();
    try {
        const result = await

