/**
 * Status filter dropdown: instantly updates results
 */

import React from 'react';

const FilterBar = ({ currentFilter, onFilterChange }) => {
  const statusOptions = [
    { value: 'All', label: 'All Statuses', count: null },
    { value: 'Inquiry', label: 'Inquiry', count: null },
    { value: 'Onboarding', label: 'Onboarding', count: null },
    { value: 'Active', label: 'Active', count: null },
    { value: 'Churned', label: 'Churned', count: null },
  ];

  const handleChange = (e) => {
    onFilterChange(e.target.value);
  };

  return (
    <div className="filter-bar">
      <label htmlFor="status-filter" className="filter-label">
        Filter by Status:
      </label>
      <select
        id="status-filter"
        className="filter-select"
        value={currentFilter}
        onChange={handleChange}
        aria-label="Filter patients by status"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;