// server/index.js
const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize the database
const init = async () => {
    await db.createTables();
    console.log('Database tables created.');
};

// RESTful Routes
app.get('/api/customers', async (req, res) => {
    const customers = await db.fetchCustomers();
    res.json(customers);
});

app.get('/api/restaurants', async (req, res) => {
    const restaurants = await db.fetchRestaurants();
    res.json(restaurants);
});

app.get('/api/reservations', async (req, res) => {
    const reservations = await db.fetchReservations();  // You will need to implement this method
    res.json(reservations);
});

app.post('/api/customers/:id/reservations', async (req, res) => {
    const { date, party_count, restaurant_id } = req.body;
    const customer_id = req.params.id;

    const reservation = await db.createReservation(date, party_count, restaurant_id, customer_id);
    res.status(201).json(reservation);
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
    const { customer_id, id } = req.params;
    await db.destroyReservation(id);  // This method already exists
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    init();
});
