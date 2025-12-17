// src/App.jsx (Updated for Geolocation)
import React, { useState, useEffect, useCallback } from 'react';

// IMPORTANT: Rename the import to match the updated service function name!
import { fetchWeatherByLocation } from './services/weatherService'; 
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ErrorMessage from './components/ErrorMessage';
import { FaSun, FaMoon, FaMapMarkerAlt } from 'react-icons/fa'; // Added FaMapMarkerAlt

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Accra'); // Default city fallback
  const [coords, setCoords] = useState(null); // NEW: State for lat/lon
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false); // NEW: Flag for first load

  // Theme Toggle Logic (Same as before)
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
  
  // Search Logic (Memoized as before)
  const handleSearch = useCallback((newCity) => {
    if (newCity.trim().toLowerCase() !== city.trim().toLowerCase()) {
      setCity(newCity);
      setCoords(null); // Clear coordinates when searching by city name
    }
  }, [city]);

  // === NEW EFFECT: ATTEMPT GEOLOCATION ON INITIAL LOAD ===
  useEffect(() => {
    if (initialLoadAttempted) return; // Only run once

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        // Success Handler
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          // Set initial city state to null so the weather effect runs using coords
          setCity(null); 
          setInitialLoadAttempted(true); // Flag success/attempt
        },
        // Error Handler (User denied, or other error)
        (err) => {
          console.error("Geolocation Error:", err);
          // Fallback: If user denies, just set the flag and let the weather effect run with the default city ('Accra')
          setInitialLoadAttempted(true);
        }
      );
    } else {
      console.log("Geolocation not supported by this browser.");
      setInitialLoadAttempted(true); // Fallback: Proceed with default city
    }
  }, [initialLoadAttempted]);


// src/App.jsx - REPLACING the combined Geolocation/Weather useEffect

// === NEW EFFECT: GEOLOCATION, FETCH, AND AUTO-REFRESH ===
useEffect(() => {
    
  // 1. Define the Fetching Function
  const loadWeather = async (params) => {
      // Set loading state if not already loading
      if (!loading) setLoading(true); 
      setError(null);
      
      try {
          const data = await fetchWeatherByLocation(params);
          setWeatherData(data);
          setCity(data.city); // Always update city state with the name from the API result
      } catch (err) {
          setError(err.message);
          // If the attempt fails and we are using coordinates, fall back to default city
          if (params.lat) {
              setCity('Accra'); 
          }
      } finally {
          setLoading(false);
      }
  };

  // 2. Initial Load Logic (Attempt Geolocation)
  let initialLoadParams = null;
  let isGeolocating = false;

  if ("geolocation" in navigator && !city) {
      isGeolocating = true;
      navigator.geolocation.getCurrentPosition(
          // SUCCESS: Use coordinates to fetch data
          (position) => {
              const params = {
                  lat: position.coords.latitude,
                  lon: position.coords.longitude
              };
              loadWeather(params);
          },
          // ERROR: Fallback to loading the default city
          (err) => {
              console.error("Geolocation failed, loading default city (Accra).", err);
              loadWeather({ city: 'Accra' }); 
          }
      );
  } 

  // 3. City Search Logic (Run when city changes, OR if geolocation is not used)
  if (city && !isGeolocating) {
      loadWeather({ city: city });
  }
  
  // 4. Set up Auto-Refresh (The new requirement!)
  // Only set up the interval if we have a successful location (city is defined)
  let intervalId;
  if (city) {
      // Set to refresh every 5 minutes (5 * 60 * 1000 ms)
      intervalId = setInterval(() => {
          console.log(`Auto-refreshing weather for ${city}...`);
          // Determine the parameter object for the refresh (use city name for simplicity)
          const refreshParams = { city: city };
          loadWeather(refreshParams);
      }, 300000); // 300,000 milliseconds = 5 minutes
  }
  
  // 5. Cleanup Function: Stop the timer when the component unmounts
  return () => {
      if (intervalId) {
          clearInterval(intervalId);
      }
  };

}, [city]); // Dependency array: runs when 'city' changes

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center p-4 sm:p-8 transition-colors duration-500">
      
      {/* Theme Toggle Button (Same as before) */}
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