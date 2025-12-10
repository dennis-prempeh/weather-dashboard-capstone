// src/components/SearchBar.jsx
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [cityInput, setCityInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Stop page refresh
    if (cityInput.trim()) {
      onSearch(cityInput.trim());
      setCityInput(''); // Clear input after search
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg transition-colors">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Enter city name..."
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          className="flex-grow p-3 text-lg border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-r-lg transition duration-200"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;