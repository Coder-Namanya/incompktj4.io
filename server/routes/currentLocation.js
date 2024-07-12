// server/routes/currentLocation.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Location = require('../models/Location');

// Example route to fetch current location data
router.get('/', async (req, res) => {
    try {
        // Example: Fetch current location from MongoDB
        const location = await Location.findOne({ name: 'Current Location' });
        if (!location) {
            throw new Error('Location not found');
        }
        
        // Example: Fetch current weather data from an external API (OpenWeatherMap)
        const apiKey = '2d6c0ebc5e5045416717b7bc8134e129';
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`);
        
        const currentLocationData = {
            name: location.name,
            temperature: weatherResponse.data.main.temp,
            condition: weatherResponse.data.weather[0].main,
            // Add more weather details as needed
        };

        res.json(currentLocationData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
