// server/routes/hourlyForecast.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Location = require('../models/Location');

// Example route to fetch hourly forecast data
router.get('/', async (req, res) => {
    try {
        // Fetch hourly forecast data from an external API (OpenWeatherMap)
        const location = await Location.findOne({ name: 'Current Location' });
        const apiKey = '2d6c0ebc5e5045416717b7bc8134e129';
        const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`);

        // Example: Extract and format relevant forecast data
        const hourlyForecastData = forecastResponse.data.list.map(item => ({
            time: item.dt_txt,
            temperature: item.main.temp,
            condition: item.weather[0].main,
            // Add more details as needed
        }));

        res.json(hourlyForecastData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
