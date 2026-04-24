import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { getProfiles, getUsers } from '../utils/storage';
import type { CleanerListing, FilterState } from '../types';
import CleanerCard from '../components/cleaners/CleanerCard';
import CleanerFilters from '../components/cleaners/CleanerFilters';

const defaultFilters: FilterState = {
  search: '',
  location: '',
  serviceType: '',
  maxPrice: 200,
  minRating: 0,
  sortBy: 'top_rated',
};

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    search: searchParams.get('q') ?? '',
  });

  const allListings = useMemo<CleanerListing[]>(() => {
    const profiles = getProfiles();
    const users = getUsers();
    return profiles
      .map(profile => {
        const user = users.find(u => u.id === profile.userId);
        return user ? { user, profile } : null;
      })
      .filter((l): l is CleanerListing => l !== null);
  }, []);

  const locations = useMemo(
    () => [...new Set(allListings.map(l => l.user.location))].sort(),
    [allListings]
  );

  const filtered = useMemo(() => {
    let result = [...allListings];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        l => l.user.firstName.toLowerCase().includes(q) ||
             l.user.lastName.toLowerCase().includes(q) ||
             l.user.location.toLowerCase().includes(q)
      );
    }

    if (filters.location) {
      result = result.filter(l => l.user.location === filters.location);
    }

    if (filters.serviceType) {
      result = result.filter(l => l.profile.servicesOffered.some(s => s.type === filters.serviceType));
    }

    if (filters.maxPrice < 200) {
      result = result.filter(l => l.profile.hourlyRate / 100 <= filters.maxPrice);
    }

    if (filters.minRating > 0) {
      result = result.filter(l => l.profile.averageRating >= filters.minRating);
    }

    switch (filters.sortBy) {
      case 'top_rated':
        result.sort((a, b) => b.profile.averageRating - a.profile.averageRating);
        break;
      case 'price_low':
        result.sort((a, b) => a.profile.hourlyRate - b.profile.hourlyRate);
        break;
      case 'price_high':
        result.sort((a, b) => b.profile.hourlyRate - a.profile.hourlyRate);
        break;
      case 'most_experienced':
        result.sort((a, b) => b.profile.yearsExperience - a.profile.yearsExperience);
        break;
    }

    return result;
  }, [allListings, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Browse Cleaners</h1>
        <p className="text-gray-500">
          {filtered.length} cleaner{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <CleanerFilters filters={filters} onChange={setFilters} locations={locations} />

        <main className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <SearchX size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No cleaners found</h3>
              <p className="text-gray-500 max-w-sm">
                Try adjusting your filters or search query to find available cleaners.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(cleaner => (
                <CleanerCard key={cleaner.user.id} cleaner={cleaner} showFavorite={true} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
