import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { FilterState } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface CleanerFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  locations: string[];
}

const serviceOptions = [
  { value: '', label: 'All Services' },
  { value: 'regular', label: 'Regular Cleaning' },
  { value: 'deep_clean', label: 'Deep Clean' },
  { value: 'move_in_out', label: 'Move In/Out' },
  { value: 'office', label: 'Office Cleaning' },
];

const ratingOptions = [
  { value: 0, label: 'Any Rating' },
  { value: 4, label: '4.0+ Stars' },
  { value: 4.5, label: '4.5+ Stars' },
  { value: 5, label: '5 Stars Only' },
];

const sortOptions = [
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'most_experienced', label: 'Most Experienced' },
];

export default function CleanerFilters({ filters, onChange, locations }: CleanerFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    onChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onChange({ search: '', location: '', serviceType: '', maxPrice: 200, minRating: 0, sortBy: 'top_rated' });
  };

  const hasActiveFilters = filters.search || filters.location || filters.serviceType || filters.maxPrice < 200 || filters.minRating > 0;

  const filterContent = (
    <div className="space-y-5">
      <Input
        label="Search"
        placeholder="Name or location..."
        value={filters.search}
        onChange={e => update('search', e.target.value)}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Location</label>
        <select
          value={filters.location}
          onChange={e => update('location', e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Locations</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Service Type</label>
        <select
          value={filters.serviceType}
          onChange={e => update('serviceType', e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {serviceOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Max Rate</label>
          <span className="text-sm font-semibold text-teal-600">${filters.maxPrice}/hr</span>
        </div>
        <input
          type="range"
          min={20}
          max={200}
          step={5}
          value={filters.maxPrice}
          onChange={e => update('maxPrice', Number(e.target.value))}
          className="w-full accent-teal-600"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>$20</span>
          <span>$200</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Minimum Rating</label>
        <select
          value={filters.minRating}
          onChange={e => update('minRating', Number(e.target.value))}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {ratingOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={e => update('sortBy', e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="w-full">
          <X size={14} />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setMobileOpen(v => !v)}
          className="w-full"
        >
          <SlidersHorizontal size={16} />
          {mobileOpen ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && (
            <span className="ml-1 bg-teal-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">!</span>
          )}
        </Button>
        {mobileOpen && (
          <div className="mt-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            {filterContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-teal-600" />
              Filters
            </h3>
            {hasActiveFilters && (
              <button onClick={clearAll} className="text-xs text-teal-600 hover:underline">Clear all</button>
            )}
          </div>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
