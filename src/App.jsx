import React, { useState, useEffect, useCallback } from 'react';


import { fetchWeatherByLocation } from './services/weatherService'; 
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ErrorMessage from './components/ErrorMessage';
import { FaSun, FaMoon, FaMapMarkerAlt } from 'react-icons/fa';

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Accra'); 
  const [coords, setCoords] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false); 

  // Theme Toggle Logic
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
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
    if (newCity.trim().toLowerCase() !== city.trim().toLowerCase()) {
      setCity(newCity);
      setCoords(null);
    }
  }, [city]);

  // GEOLOCATION ON INITIAL LOAD
  useEffect(() => {
    if (initialLoadAttempted) return; 

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          
          setCity(null); 
          setInitialLoadAttempted(true); 
        },

        // Error Handler
        (err) => {
          console.error("Geolocation Error:", err);
          
          setInitialLoadAttempted(true);
        }
      );
    } else {
      console.log("Geolocation not supported by this browser.");
      setInitialLoadAttempted(true); 
    }
  }, [initialLoadAttempted]);



// GEOLOCATION, FETCH, AND AUTO-REFRESH 
useEffect(() => {
    
  const loadWeather = async (params) => {
      if (!loading) setLoading(true); 
      setError(null);
      
      try {
          const data = await fetchWeatherByLocation(params);
          setWeatherData(data);
          setCity(data.city); 
      } catch (err) {
          setError(err.message);
          if (params.lat) {
              setCity('Accra'); 
          }
      } finally {
          setLoading(false);
      }
  };

  // Initial Load Logic
  let initialLoadParams = null;
  let isGeolocating = false;

  if ("geolocation" in navigator && !city) {
      isGeolocating = true;
      navigator.geolocation.getCurrentPosition(
          (position) => {
              const params = {
                  lat: position.coords.latitude,
                  lon: position.coords.longitude
              };
              loadWeather(params);
          },
          (err) => {
              console.error("Geolocation failed, loading default city (Accra).", err);
              loadWeather({ city: 'Accra' }); 
          }
      );
  } 

  // City Search Logic
  if (city && !isGeolocating) {
      loadWeather({ city: city });
  }
  
  let intervalId;
  if (city) {
      intervalId = setInterval(() => {
          console.log(`Auto-refreshing weather for ${city}...`);
          const refreshParams = { city: city };
          loadWeather(refreshParams);
      }, 300000); 
  }
  
  return () => {
      if (intervalId) {
          clearInterval(intervalId);
      }
  };

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
      <h1 className="text-5xl font-extrabold text-teal-600 dark:text-cyan-400 mb-10 transition-colors duration-500 mt-12">
        Weather Dashboard
      </h1>

      {/* Search Bar Component */}
      <SearchBar onSearch={handleSearch} />
      
      {/* Loading State */}
      {loading && (
        <p className="text-xl text-gray-700 dark:text-gray-300 mt-4 flex items-center">
          {coords ? <FaMapMarkerAlt className="mr-2 text-red-500" /> : null}
          Loading weather for {coords ? 'your location' : city}...
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