// src/components/CurrentLocationDetails.js

import React from 'react';

function CurrentLocationDetails({ locationData }) {
    return (
        <div>
            <h2>{locationData.name}</h2>
            <p>Temperature: {locationData.temperature}°C</p>
            <p>Condition: {locationData.condition}</p>
            {/* Add more details as needed */}
        </div>
    );
}

export default CurrentLocationDetails;
