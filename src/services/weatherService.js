// src/services/weatherService.js
import axios from 'axios';

// Get environment variables exposed by Vite
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Fetches current weather data for a given city name.
 * @param {string} city - The name of the city to fetch weather for.
 * @returns {object} The structured weather data.
 */
export const fetchWeatherByCity = async (city) => {
    if (!city || !API_KEY) {
        throw new Error('API Key or City name is missing.');
    }
    
    // Units set to metric (Celsius). Use 'imperial' for Fahrenheit/mph.
    // Wind speed is converted from m/s to km/h upon return.
    const url = `${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        
        // OpenWeatherMap uses 'cod' (200 is success, 400s are errors)
        if (response.data.cod !== 200) {
             throw new Error(response.data.message || 'Error fetching weather data.');
        }

        const data = response.data;
        
        // Structure and clean the data
        return {
            city: data.name,
            country: data.sys.country,
            temperature: Math.round(data.main.temp),     // Current temperature
            feelsLike: Math.round(data.main.feels_like), // Feels like temp
            humidity: data.main.humidity,                // Humidity
            windSpeed: Math.round(data.wind.speed * 3.6),// Convert m/s to km/h 
            weatherCondition: data.weather[0].main,      // e.g., 'Clouds'
            iconCode: data.weather[0].icon,              // Icon code (e.g., '04d') 
            description: data.weather[0].description,    // e.g., 'overcast clouds'
        };

    } catch (error) {
        // Implement proper error handling [cite: 1, 3]
        if (error.response && error.response.status === 404) {
             throw new Error(`City not found: "${city}". Please try again.`);
        }
        if (error.response && error.response.status === 401) {
             throw new Error('Unauthorized: Check your API Key in the .env file.');
        }
        throw new Error('Could not connect to the weather service. Check network or API key activation.');
    }
};