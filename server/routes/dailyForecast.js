// server/routes/dailyForecast.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Location = require('../models/Location');
const DailyForecast = require('../models/DailyForecast');

// Example route to fetch daily forecast data
router.get('/', async (req, res) => {
    try {
        // Fetch daily forecast data from an external API (OpenWeatherMap)
        const location = await Location.findOne({ name: 'Current Location' });
        const apiKey = '2d6c0ebc5e5045416717b7bc8134e129';
        const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${location.latitude}&lon=${location.longitude}&cnt=7&appid=${apiKey}&units=metric`);

        // Example: Extract and format relevant forecast data
        const dailyForecastData = forecastResponse.data.list.map(item => ({
            date: new Date(item.dt * 1000), // Convert timestamp to Date object
            temperature: item.temp.day,
            condition: item.weather[0].main,
            // Add more details as needed
        }));

        // Save daily forecast data to MongoDB (optional)
        await DailyForecast.deleteMany(); // Clear existing data
        await DailyForecast.insertMany(dailyForecastData);

        res.json(dailyForecastData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
