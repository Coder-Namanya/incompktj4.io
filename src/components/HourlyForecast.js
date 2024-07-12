// src/components/HourlyForecast.js

import React from 'react';

function HourlyForecast({ forecastData }) {
    return (
        <div>
            <h2>Hourly Forecast</h2>
            {forecastData.map(hour => (
                <div key={hour.time}>
                    <p>{hour.time}</p>
                    <p>Temperature: {hour.temperature}°C</p>
                    <p>Condition: {hour.condition}</p>
                    {/* Add more details as needed */}
                </div>
            ))}
        </div>
    );
}

export default HourlyForecast;
