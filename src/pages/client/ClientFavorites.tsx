import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { getProfiles, getUsers } from '../../utils/storage';
import type { CleanerListing } from '../../types';
import CleanerCard from '../../components/cleaners/CleanerCard';
import Button from '../../components/ui/Button';

export default function ClientFavorites() {
  const { favorites } = useApp();

  const profiles = getProfiles();
  const users = getUsers();

  const favoriteListings: CleanerListing[] = favorites
    .map(id => {
      const user = users.find(u => u.id === id);
      const profile = profiles.find(p => p.userId === id);
      if (!user || !profile) return null;
      return { user, profile };
    })
    .filter(Boolean) as CleanerListing[];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart size={24} className="text-red-500 fill-red-500" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Favorites</h1>
      </div>

      {favoriteListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart size={48} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No saved cleaners yet</h3>
          <p className="text-gray-400 max-w-sm mb-6">
            Browse cleaners and tap the heart icon to save your favorites for quick booking.
          </p>
          <Link to="/browse">
            <Button variant="primary">Browse Cleaners</Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-gray-500 mb-5">{favoriteListings.length} saved cleaner{favoriteListings.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favoriteListings.map(cleaner => (
              <CleanerCard key={cleaner.user.id} cleaner={cleaner} showFavorite={true} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
