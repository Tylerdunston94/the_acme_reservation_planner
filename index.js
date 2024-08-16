// Import the required modules
const express = require('express');
const db = require('./db');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize the database
const initDatabase = async () => {
    await db.createTables();
    console.log('Database tables created.');
};

// GET route to fetch all customers
app.get('/api/customers', async (req, res) => {
    const customers = await db.fetchCustomers();
    res.json(customers);
});

// GET route to fetch all restaurants
app.get('/api/restaurants', async (req, res) => {
    const restaurants = await db.fetchRestaurants();
    res.json(restaurants);
});

// GET route to fetch all reservations
app.get('/api/reservations', async (req, res) => {
    const reservations = await db.fetchReservations();
    res.json(reservations);
});

// POST route to create a new reservation for a customer
app.post('/api/customers/:id/reservations', async (req, res) => {
    const customer_id = req.params.id;
    const { date, party_count, restaurant_id } = req.body;
    const newReservation = await db.createReservation(date, party_count, restaurant_id, customer_id);
    res.status(201).json(newReservation);
});

// DELETE route to remove a reservation for a customer
app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
    const reservationId = req.params.id;
    await db.destroyReservation(reservationId);
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    initDatabase();
});
