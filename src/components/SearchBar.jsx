import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; 

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-xl flex flex-col sm:flex-row items-center bg-white dark:bg-gray-800 rounded-xl shadow-xl p-2 mb-10 transition-colors duration-500"
    >
      <input
        type="text"
        placeholder="Enter city name..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        // Input styling
        className="flex-grow w-full bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-lg p-3"
      />
      <button
        type="submit"
        // Button styling
        className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4 px-6 py-3 bg-teal-600 dark:bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-all flex justify-center items-center"
        aria-label="Search"
      >
        <FaSearch className="mr-2" /> 
        Search
      </button>
    </form>
  );
};

export default SearchBar;