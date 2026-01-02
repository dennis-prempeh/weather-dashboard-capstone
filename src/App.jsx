import React, { useState, useEffect, useCallback } from 'react';
import { fetchWeatherByLocation, fetch5DayForecast } from './services/weatherService'; 
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import ErrorMessage from './components/ErrorMessage';
import { FaSun, FaMoon, FaMapMarkerAlt } from 'react-icons/fa';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]); // New state for 5-day forecast
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Theme Toggle Logic
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Search Logic
  const handleSearch = useCallback((newCity) => {
    setCity(newCity);
  }, []);

  // Main Fetching Function: Now fetches Current AND Forecast
  const loadAllWeatherData = async (params) => {
    setLoading(true);
    setError(null);
    try {
        // Run both API calls at the same time
        const [current, fiveDay] = await Promise.all([
            fetchWeatherByLocation(params),
            fetch5DayForecast(params)
        ]);
        
        setWeatherData(current);
        setForecast(fiveDay);
        setCity(current.city); 
    } catch (err) {
        setError(err.message);
        if (params.lat) setCity('Accra'); // Fallback if geo fails
    } finally {
        setLoading(false);
    }
  };

  // COMBINED LOGIC: Geolocation, Fetch, and Auto-Refresh
  useEffect(() => {
    // 1. Initial Load: Geolocation
    if ("geolocation" in navigator && !city) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                loadAllWeatherData({ 
                    lat: position.coords.latitude, 
                    lon: position.coords.longitude 
                });
            },
            (err) => {
                console.error("Geolocation failed:", err);
                setCity('Accra');
            }
        );
    } 

    // 2. City Search & Auto-Refresh
    if (city) {
        loadAllWeatherData({ city: city });

        const intervalId = setInterval(() => {
            console.log(`Auto-refreshing for ${city}...`);
            loadAllWeatherData({ city: city });
        }, 300000); // 5 minutes

        return () => clearInterval(intervalId);
    }
  }, [city]); 

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center p-4 sm:p-8 transition-colors duration-500">
      
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-yellow-400 shadow-lg hover:shadow-xl transition-all"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
      </button>

      {/* Header */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-600 dark:text-teal-400 mb-10 transition-colors duration-500 mt-12">
        Weather Dashboard
      </h1>

      <SearchBar onSearch={handleSearch} />
      
      {loading && !weatherData && (
        <p className="text-xl text-gray-700 dark:text-gray-300 mt-4 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-teal-500 animate-bounce" />
          Loading weather...
        </p>
      )}

      {error && !loading && (
        <ErrorMessage message={error} />
      )}

      {/* Current Weather Card */}
      {weatherData && !loading && !error && (
        <WeatherCard data={weatherData} />
      )}

      {/* 5-Day Forecast */}
      {forecast.length > 0 && !loading && !error && (
        <Forecast days={forecast} />
      )}
    </div>
  );
}

export default App;