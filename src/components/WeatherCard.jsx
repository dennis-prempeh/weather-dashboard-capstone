import React from 'react';
import { 
    FaSun, FaCloud, FaCloudRain, FaSnowflake, 
    FaSmog, FaBolt, FaQuestionCircle 
} from 'react-icons/fa';

// Function to map weather conditions to React Icons
const getWeatherIcon = (condition) => {
  switch (condition) {
    case 'Clear':
      return <FaSun className="text-yellow-400" />;
    case 'Clouds':
      return <FaCloud className="text-gray-400" />;
    case 'Rain':
    case 'Drizzle':
      return <FaCloudRain className="text-blue-500" />;
    case 'Thunderstorm':
      return <FaBolt className="text-yellow-600" />;
    case 'Snow':
      return <FaSnowflake className="text-blue-200" />;
    case 'Mist':
    case 'Smoke':
    case 'Haze':
    case 'Dust':
    case 'Fog':
    case 'Sand':
    case 'Ash':
    case 'Squall':
    case 'Tornado':
      return <FaSmog className="text-gray-500" />;
    default:
      return <FaQuestionCircle className="text-gray-600" />;
  }
};

const WeatherCard = ({ data }) => {
  const IconComponent = getWeatherIcon(data.weatherCondition);

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-gray-800 dark:text-gray-100 transition-colors">
      
      {/* City and Country Header */}
      <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h2 className="text-4xl font-extrabold text-teal-600 dark:text-cyan-400">
            {data.city}, {data.country}
          </h2>
          <p className="text-lg font-medium capitalize text-gray-600 dark:text-gray-300">
            {data.description}
          </p>
        </div>
        <div className="text-6xl">{IconComponent}</div>
      </div>

      {/* Main Temperature Display */}
      <div className="text-center mb-6">
        <p className="text-8xl font-light text-black dark:text-white">
          {data.temperature}°C
        </p>
        <p className="text-xl text-gray-500 dark:text-gray-400 mt-2">
          Feels like {data.feelsLike}°C
        </p>
      </div>

      {/* Details Grid for (Humidity, Wind Speed, Condition) */}
      <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-gray-900 p-4 rounded-xl shadow-inner">
        
        {/* Humidity  */}
        <div className="text-center">
          <p className="text-[10px] sm:text-sm font-light text-gray-500 dark:text-gray-400">Humidity</p>
          <p className="text-sm sm:text-xl font-semibold dark:text-white">{data.humidity}%</p>
        </div>
        
        {/* Wind Speed  */}
        <div className="text-center border-l border-r border-gray-300 dark:border-gray-700 px-1">
          <p className="text-[10px] sm:text-sm font-light text-gray-500 dark:text-gray-400">Wind Speed</p>
          <p className="text-sm sm:text-xl font-semibold dark:text-white">{data.windSpeed} km/h</p>
        </div>
        
        {/* Weather Condition  */}
        <div className="text-center">
          <p className="text-[10px] sm:text-sm font-light text-gray-500 dark:text-gray-400">Condition</p>
          <p className="text-sm sm:text-xl font-semibold dark:text-white truncate">{data.weatherCondition}</p>
        </div>

      </div>
    </div>
  );
};

export default WeatherCard;