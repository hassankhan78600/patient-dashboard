/**
 * A reusable and controlled search input component.
 * It features debouncing to delay the execution of the search callback, optimizing performance by reducing the number of search queries. 
 * The component communicates the search term to its parent via the `onSearch` prop.
 */

import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Search patients by name...' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          aria-label="Search patients"
        />
        {searchTerm && (
          <button
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;