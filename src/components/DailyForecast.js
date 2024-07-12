// src/components/DailyForecast.js

import React from 'react';

function DailyForecast({ dailyForecastData }) {
    return (
        <div>
            <h2>Daily Forecast</h2>
            {dailyForecastData.map(day => (
                <div key={day.date}>
                    <h3>{day.date.toLocaleDateString()}</h3>
                    <p>Temperature: {day.temperature}°C</p>
                    <p>Condition: {day.condition}</p>
                    {/* Add more details as needed */}
                </div>
            ))}
        </div>
    );
}

export default DailyForecast;
