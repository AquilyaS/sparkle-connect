import { Link } from 'react-router-dom';
import { MapPin, Heart, ShieldCheck, Star } from 'lucide-react';
import type { CleanerListing } from '../../types';
import { formatCentsShort, getBadgeLabel, getBadgeColorClasses, getServiceLabel, getServiceIcon } from '../../utils/formatters';
import { useApp } from '../../hooks/useApp';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

interface CleanerCardProps {
  cleaner: CleanerListing;
  showFavorite?: boolean;
}

export default function CleanerCard({ cleaner, showFavorite = true }: CleanerCardProps) {
  const { user, profile } = cleaner;
  const { isFavorite, toggleFavorite } = useApp();
  const favorited = isFavorite(user.id);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden group">
      {/* Top section */}
      <div className="relative p-5 pb-4 flex flex-col items-center text-center">
        {/* Favorite button */}
        {showFavorite && (
          <button
            onClick={e => { e.preventDefault(); toggleFavorite(user.id); }}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={18}
              className={favorited ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}
            />
          </button>
        )}

        {/* Avatar with verification badge */}
        <div className="relative mb-3">
          <Avatar src={user.avatarUrl} firstName={user.firstName} lastName={user.lastName} size="xl" />
          {profile.backgroundChecked && (
            <span className="absolute -bottom-1 -right-1 bg-teal-600 rounded-full p-1">
              <ShieldCheck size={12} className="text-white" />
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-base">{user.firstName} {user.lastName}</h3>

        <div className="flex items-center gap-1 mt-1 text-gray-500">
          <MapPin size={13} />
          <span className="text-xs">{user.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <Star size={15} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-gray-800">{profile.averageRating.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({profile.totalReviews} reviews)</span>
        </div>

        {/* Hourly rate */}
        <div className="mt-2">
          <span className="text-lg font-bold text-teal-700">{formatCentsShort(profile.hourlyRate)}</span>
          <span className="text-xs text-gray-500">/hr</span>
        </div>
      </div>

      {/* Services */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5 justify-center">
        {profile.servicesOffered.slice(0, 3).map(s => {
          const ServiceIcon = getServiceIcon(s.type);
          return (
            <Badge key={s.type} color="teal" className="flex items-center gap-1">
              <ServiceIcon size={12} />
              {getServiceLabel(s.type)}
            </Badge>
          );
        })}
      </div>

      {/* Cleaner badges */}
      {profile.badges.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5 justify-center">
          {profile.badges.slice(0, 2).map(badge => (
            <span
              key={badge}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColorClasses(badge)}`}
            >
              {getBadgeLabel(badge)}
            </span>
          ))}
        </div>
      )}

      {/* Action */}
      <div className="mt-auto px-4 pb-4 pt-2">
        <Link
          to={`/cleaners/${user.id}`}
          className="block w-full text-center py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
