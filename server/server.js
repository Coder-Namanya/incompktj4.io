const express = require('express');
const mongoose = require('mongoose');
const Location = require('./models/Location'); // Adjust the path as per your file structure

const app = express();
app.use(express.json());

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/weatherApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// POST route to save location
app.post('/api/saveLocation', async (req, res) => {
    const { location } = req.body;
    try {
        const savedLocation = await Location.create({ name: location });
        res.status(201).json(savedLocation);
    } catch (error) {
        console.error('Error saving location:', error);
        res.status(500).json({ error: 'Failed to save location' });
    }
});

// GET route to fetch saved locations
app.get('/api/savedLocations', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (error) {
        console.error('Error fetching saved locations:', error);
        res.status(500).json({ error: 'Failed to fetch saved locations' });
    }
});

// DELETE route to delete location
app.delete('/api/deleteLocation/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Location.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting location:', error);
        res.status(500).json({ error: 'Failed to delete location' });
    }
});

// Replace this with your actual port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
