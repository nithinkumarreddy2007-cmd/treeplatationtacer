import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react';

export const TreeFilters = ({ filters, setFilters, cities = [], onReset }) => {
  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: '#ffffff' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        alignItems: 'flex-end',
      }}>
        {/* Search Input */}
        <div>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Search size={14} />
            <span>Search Records</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, species, person, notes..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={14} />
            <span>Health Status</span>
          </label>
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="All">All Statuses</option>
            <option value="Healthy">Healthy</option>
            <option value="Growing">Growing</option>
            <option value="Planted">Planted</option>
            <option value="Needs Attention">Needs Attention</option>
            <option value="Deceased">Deceased</option>
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="form-label">City / Region</label>
          <select
            className="form-select"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          >
            <option value="All">All Cities</option>
            {cities.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowUpDown size={14} />
            <span>Sort Order</span>
          </label>
          <select
            className="form-select"
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            <option value="-plantedDate">Newest Planted First</option>
            <option value="plantedDate">Oldest Planted First</option>
            <option value="commonName">Tree Name (A - Z)</option>
            <option value="-heightCm">Tallest Height First</option>
          </select>
        </div>

        {/* Reset Button */}
        <div>
          <button
            type="button"
            onClick={onReset}
            className="btn btn-secondary"
            style={{ width: '100%', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={15} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreeFilters;
