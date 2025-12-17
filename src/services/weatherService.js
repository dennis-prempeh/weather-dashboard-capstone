// src/services/weatherService.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Fetches current weather data for a location defined by city name OR coordinates.
 * @param {object} params - Object containing either {city: string} or {lat: number, lon: number}.
 * @returns {object} The structured weather data.
 */
export const fetchWeatherByLocation = async (params) => {
    if (!API_KEY) {
        throw new Error('API Key is missing.');
    }
    
    let url = `${BASE_URL}weather?appid=${API_KEY}&units=metric`;
    
    // Determine the query type (City Name or Coordinates)
    if (params.city) {
        url += `&q=${params.city}`;
    } else if (params.lat && params.lon) {
        url += `&lat=${params.lat}&lon=${params.lon}`;
    } else {
        throw new Error('Invalid location parameters. Must provide city OR latitude/longitude.');
    }

    try {
        const response = await axios.get(url);
        
        if (response.data.cod !== 200) {
             throw new Error(response.data.message || 'Error fetching weather data.');
        }

        const data = response.data;
        
        // Structure and clean the data
        return {
            city: data.name,
            country: data.sys.country,
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6),
            weatherCondition: data.weather[0].main,
            iconCode: data.weather[0].icon,
            description: data.weather[0].description,
        };

    } catch (error) {
        if (error.response && error.response.status === 404) {
             // Use a generic error message since we don't know if it's city or coordinates failing
             throw new Error(`Location not found. Please check your input or connection.`);
        }
        if (error.response && error.response.status === 401) {
             throw new Error('Unauthorized: Check your API Key in the .env file.');
        }
        throw new Error('Could not connect to the weather service. Check network or API key activation.');
    }
};

// IMPORTANT: Rename the function here to match the new export name!
// If you used the old name: 'fetchWeatherByCity' anywhere else, it will break.