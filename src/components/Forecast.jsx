// src/components/Forecast.jsx
import React from 'react';

const Forecast = ({ days }) => {
  return (
    <div className="w-full max-w-lg mt-8">
      <h3 className="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 px-2">
        5-Day Forecast
      </h3>
      <div className="flex flex-col gap-3">
        {days.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md transition-colors duration-500"
          >
            <span className="w-12 font-bold text-gray-700 dark:text-gray-200">{item.day}</span>
            
            <div className="flex items-center gap-2">
              <img 
                src={`https://openweathermap.org/img/wn/${item.icon}.png`} 
                alt={item.condition}
                className="w-10 h-10"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 w-20 capitalize">
                {item.condition}
              </span>
            </div>

            <span className="font-extrabold text-teal-600 dark:text-teal-400">
              {item.temp}°C
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;