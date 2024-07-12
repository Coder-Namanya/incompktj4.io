// server/routes/search.js

const express = require('express');
const router = express.Router();
const axios = require('axios');

// Example: OpenWeatherMap API key (replace with your actual key)
const apiKey = '2d6c0ebc5e5045416717b7bc8134e129';

router.get('/', async (req, res) => {
    const { location } = req.query;

    try {
        // Example: Fetch weather data from OpenWeatherMap
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);

        const weatherData = {
            temperature: weatherResponse.data.main.temp,
            condition: weatherResponse.data.weather[0].main,
            // Add more weather details as needed
        };

        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
