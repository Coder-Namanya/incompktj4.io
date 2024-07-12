import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const App = () => {
    const [location, setLocation] = useState('');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [dailyForecast, setDailyForecast] = useState([]);
    const [yearlyOverview, setYearlyOverview] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const apiKey = '2d6c0ebc5e5045416717b7bc8134e129'; // Replace with your actual API key

    // Generate random yearly overview data for India
    const generateYearlyOverview = useCallback(() => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const yearlyData = months.map((month) => ({
            month,
            averageHumidity: getRandomNumber(60, 80),
            averageUVIndex: getRandomNumber(5, 8),
            totalRainfall: getRandomNumber(50, 200),
        }));
        setYearlyOverview(yearlyData);
    }, []); // Empty dependency array because the function doesn't depend on any outside variables

    // Fetch current weather data
    const fetchCurrentWeather = async (location) => {
        try {
            setLoading(true);
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Current weather data not available');
            }

            const data = await response.json();
            setCurrentWeather({
                temperature: data.main.temp,
                feels_like: data.main.feels_like,
                humidity: data.main.humidity,
                visibility: data.visibility,
                condition: data.weather[0].description,
                icon: data.weather[0].icon,
                location: data.name,
            });
            setError('');
        } catch (error) {
            console.error('Error fetching current weather data:', error);
            setError('Error fetching current weather data');
            setCurrentWeather(null);
        } finally {
            setLoading(false);
        }
    };

    // Fetch hourly and daily forecasts
    const fetchForecasts = useCallback(async (location) => {
        try {
            setLoading(true);
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Forecast data not available');
            }

            const data = await response.json();
            const { list } = data;

            // Filter hourly forecasts (next 24 hours)
            const next24Hours = list.slice(0, 8);
            setHourlyForecast(next24Hours);

            // Filter daily forecasts (next 5 days)
            const next5Days = list.filter((forecast) =>
                forecast.dt_txt.includes('12:00')
            );
            setDailyForecast(next5Days);

            // Generate random yearly overview data for India
            generateYearlyOverview();
            setError('');
        } catch (error) {
            console.error('Error fetching forecast data:', error);
            setError('Error fetching forecast data');
            setHourlyForecast([]);
            setDailyForecast([]);
        } finally {
            setLoading(false);
        }
    }, [generateYearlyOverview]); // Include generateYearlyOverview in the dependency array

    // Helper function to generate random number within a range
    const getRandomNumber = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (location.trim() !== '') {
            fetchCurrentWeather(location);
            fetchForecasts(location);
        }
    };

    // Fetch initial weather data on component mount
    useEffect(() => {
        fetchCurrentWeather('Delhi'); // Default location set to Delhi
        fetchForecasts('Delhi'); // Default location set to Delhi
    }, [fetchForecasts]); // Include fetchForecasts in the dependency array

    // Format date and time
    const formatDate = (dt_txt) => {
        const date = new Date(dt_txt);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        return { time, month, day };
    };

    return (
        <div className="App">
            <div className="header">
                <h1>Weather App</h1>
                <form className="search-bar" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter city name"
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            {loading && <p>Loading...</p>}

            <div className="weather-box current-location">
                {currentWeather && (
                    <div>
                        <h2>Current Weather in {currentWeather.location}</h2>
                        <div className="current-weather">
                            <h3>Temperature:<p>{currentWeather.temperature}°C</p></h3>
                            <h3>Feels Like: <p>{currentWeather.feels_like}°C</p></h3>
                            <h3>Condition: <p>{currentWeather.condition}</p></h3>
                            <h3>Humidity: <p>{currentWeather.humidity}%</p></h3>
                            <h3>Visibility: <p>{currentWeather.visibility} meters</p></h3>
                        </div>
                    </div>
                )}
                {error && <p>Error: {error}</p>}
            </div>

            <div className="weather-box hourly-forecast">
                {hourlyForecast.length > 0 && (
                    <div>
                        <h2>Hourly Forecast for {formatDate(hourlyForecast[0].dt_txt).day} {formatDate(hourlyForecast[0].dt_txt).month}</h2>
                        <table className="forecast-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Temperature (°C)</th>
                                    <th>Condition</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hourlyForecast.map((forecast, index) => {
                                    const { time } = formatDate(forecast.dt_txt);
                                    return (
                                        <tr key={index}>
                                            <td>{time}</td>
                                            <td>{forecast.main.temp}</td>
                                            <td>{forecast.weather[0].description}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {error && <p>Error: {error}</p>}
            </div>

            <div className="weather-box daily-forecast">
                {dailyForecast.length > 0 && (
                    <div>
                        <h2>Daily Forecast</h2>
                        <table className="forecast-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Temperature (°C)</th>
                                    <th>Condition</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyForecast.map((forecast, index) => {
                                    const { day, month } = formatDate(forecast.dt_txt);
                                    return (
                                        <tr key={index}>
                                            <td>{`${day} ${month}`}</td>
                                            <td>{forecast.main.temp}</td>
                                            <td>
                                                <img
                                                    src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                                    alt="Weather Icon"
                                                    className="weather-icon-small"
                                                />
                                                {forecast.weather[0].description}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {error && <p>Error: {error}</p>}
            </div>

            <div className="weather-box yearly-overview">
                {yearlyOverview.length > 0 && (
                    <div>
                        <h2>Yearly Overview</h2>
                        <table className="overview-table">
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Average Humidity (%)</th>
                                    <th>Average UV Index</th>
                                    <th>Total Rainfall (mm)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {yearlyOverview.map((overview, index) => (
                                    <tr key={index}>
                                        <td>{overview.month}</td>
                                        <td>{overview.averageHumidity.toFixed(2)}</td>
                                        <td>{overview.averageUVIndex.toFixed(2)}</td>
                                        <td>{overview.totalRainfall.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
