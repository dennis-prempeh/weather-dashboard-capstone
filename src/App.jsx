// src/App.jsx
import React, { useState, useEffect } from 'react';

// Import services and components
import { fetchWeatherByCity } from './services/weatherService'; 
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ErrorMessage from './components/ErrorMessage';


function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Accra'); // Default city for initial load
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function passed to SearchBar to update the city state
  const handleSearch = (newCity) => {
    // Only update if the city name is different
    if (newCity.trim().toLowerCase() !== city.trim().toLowerCase()) {
      setCity(newCity);
    }
  };

  // useEffect hook to handle data fetching whenever the 'city' state changes
  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      setError(null);      // Clear previous errors [cite: 3]
      setWeatherData(null); // Clear previous data

      try {
        const data = await fetchWeatherByCity(city);
        setWeatherData(data);
      } catch (err) {
        setError(err.message); // Display user-friendly error [cite: 3]
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      loadWeather();
    }
    
    // Cleanup function (optional, but good practice)
    return () => {
        // Any cleanup logic here
    };
  }, [city]); // Dependency array: runs on mount and whenever 'city' changes

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center p-4 sm:p-8 transition-colors">
      
      {/* Header */}
      <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-10 transition-colors">
        Weather Dashboard
      </h1>

      {/* Search Bar Component */}
      <SearchBar onSearch={handleSearch} />
      
      {/* Loading State */}
      {loading && (
        <p className="text-xl text-gray-700 dark:text-gray-300 mt-4">
          Loading weather for {city}...
        </p>
      )}

      {/* Error Message Component */}
      {error && !loading && (
        <ErrorMessage message={error} />
      )}

      {/* Weather Card Component */}
      {weatherData && !loading && !error && (
        <WeatherCard data={weatherData} />
      )}
    </div>
  );
}

export default App;