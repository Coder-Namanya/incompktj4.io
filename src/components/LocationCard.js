// App.js (or create a new LocationCard.js file)
import React from 'react';

const LocationCard = ({ location }) => {
    return (
        <div className="location-card">
            <p>{location}</p>
        </div>
    );
};

export default LocationCard;
