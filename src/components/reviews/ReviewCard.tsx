import type { Review, User } from '../../types';
import { formatDisplayDate } from '../../utils/dateHelpers';
import Avatar from '../ui/Avatar';
import StarRating from '../ui/StarRating';

interface ReviewCardProps {
  review: Review;
  client: User;
}

export default function ReviewCard({ review, client }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start gap-3">
        <Avatar src={client.avatarUrl} firstName={client.firstName} lastName={client.lastName} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="font-medium text-gray-900 text-sm">{client.firstName} {client.lastName}</p>
            <span className="text-xs text-gray-400">{formatDisplayDate(review.createdAt.split('T')[0])}</span>
          </div>
          <StarRating rating={review.rating} size="sm" className="mt-1 mb-2" />
          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}
