// routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// POST route to save a new location
router.post('/saveLocation', async (req, res) => {
    const { location } = req.body;

    try {
        // Check if location name already exists
        const existingLocation = await Location.findOne({ name: location });
        if (existingLocation) {
            return res.status(400).json({ message: 'Location already exists' });
        }

        // Create new location document
        const newLocation = new Location({ name: location });
        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (error) {
        console.error('Error saving location:', error);
        res.status(500).json({ message: 'Failed to save location' });
    }
});

// GET route to fetch all saved locations
router.get('/savedLocations', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (error) {
        console.error('Error fetching saved locations:', error);
        res.status(500).json({ message: 'Failed to fetch locations' });
    }
});

// DELETE route to delete a saved location by ID
router.delete('/deleteLocation/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLocation = await Location.findByIdAndDelete(id);
        if (!deletedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json({ message: 'Location deleted successfully' });
    } catch (error) {
        console.error('Error deleting location:', error);
        res.status(500).json({ message: 'Failed to delete location' });
    }
});

module.exports = router;
