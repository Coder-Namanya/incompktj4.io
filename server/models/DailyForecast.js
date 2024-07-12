// server/models/DailyForecast.js

const mongoose = require('mongoose');

const dailyForecastSchema = new mongoose.Schema({
    date: Date,
    temperature: Number,
    condition: String,
    // Add more fields as needed
});

module.exports = mongoose.model('DailyForecast', dailyForecastSchema);
