// src/components/SearchForm.js

import React, { useState } from 'react';
import axios from 'axios';

function SearchForm({ onSearch }) {
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/search?location=${location}`);
            setWeatherData(response.data);
            onSearch(); // Optionally pass data back to parent component
        } catch (error) {
            setError('Error fetching weather data');
            console.error('Error fetching weather data:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
            />
            <button onClick={handleSearch}>Search</button>

            {weatherData && (
                <div>
                    <h2>Weather for {location}</h2>
                    <p>Temperature: {weatherData.temperature}°C</p>
                    <p>Condition: {weatherData.condition}</p>
                    {/* Add more weather details as needed */}
                </div>
            )}

            {error && <p>{error}</p>}
        </div>
    );
}

export default SearchForm;
