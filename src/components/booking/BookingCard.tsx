import { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import type { Booking, User } from '../../types';
import { formatDisplayDate, formatTime } from '../../utils/dateHelpers';
import { formatCents, getStatusLabel, getStatusColorClasses, getServiceLabel } from '../../utils/formatters';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { useBookings } from '../../hooks/useBookings';
import { useApp } from '../../hooks/useApp';

interface BookingCardProps {
  booking: Booking;
  otherUser: User;
  userRole: 'client' | 'cleaner';
  onReview?: (bookingId: string) => void;
}

export default function BookingCard({ booking, otherUser, userRole, onReview }: BookingCardProps) {
  const { updateBookingStatus, hasReviewForBooking } = useBookings();
  const { showToast } = useApp();
  const [loading, setLoading] = useState(false);

  const handleAction = async (status: Parameters<typeof updateBookingStatus>[1]) => {
    setLoading(true);
    try {
      await updateBookingStatus(booking.id, status);
      const messages: Record<string, string> = {
        confirmed: 'Booking confirmed!',
        declined: 'Booking declined',
        cancelled: 'Booking cancelled',
      };
      showToast(messages[status] ?? 'Updated', status === 'declined' || status === 'cancelled' ? 'info' : 'success');
    } catch {
      showToast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const reviewed = hasReviewForBooking(booking.id);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-start gap-3 mb-4">
        <Avatar src={otherUser.avatarUrl} firstName={otherUser.firstName} lastName={otherUser.lastName} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-semibold text-gray-900">{otherUser.firstName} {otherUser.lastName}</p>
              <p className="text-sm text-gray-500">{getServiceLabel(booking.serviceType)}</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClasses(booking.status)}`}>
              {getStatusLabel(booking.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={15} className="text-teal-500 flex-shrink-0" />
          <span>{formatDisplayDate(booking.scheduledDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={15} className="text-teal-500 flex-shrink-0" />
          <span>{formatTime(booking.scheduledTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={15} className="text-teal-500 flex-shrink-0" />
          <span className="truncate">{booking.city}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign size={15} className="text-teal-500 flex-shrink-0" />
          <span className="font-medium text-gray-900">{formatCents(booking.totalAmountCents)}</span>
        </div>
      </div>

      {booking.notes && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-4 italic">"{booking.notes}"</p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {userRole === 'cleaner' && booking.status === 'pending' && (
          <>
            <Button size="sm" variant="primary" isLoading={loading} onClick={() => handleAction('confirmed')}>
              Accept
            </Button>
            <Button size="sm" variant="danger" isLoading={loading} onClick={() => handleAction('declined')}>
              Decline
            </Button>
          </>
        )}
        {userRole === 'cleaner' && booking.status === 'confirmed' && (
          <Button size="sm" variant="ghost" isLoading={loading} onClick={() => handleAction('cancelled')}>
            Cancel
          </Button>
        )}
        {userRole === 'client' && (booking.status === 'pending' || booking.status === 'confirmed') && (
          <Button size="sm" variant="ghost" isLoading={loading} onClick={() => handleAction('cancelled')}>
            Cancel Booking
          </Button>
        )}
        {userRole === 'client' && booking.status === 'completed' && !reviewed && onReview && (
          <Button size="sm" variant="secondary" onClick={() => onReview(booking.id)}>
            Leave Review
          </Button>
        )}
        {userRole === 'client' && booking.status === 'completed' && reviewed && (
          <span className="text-xs text-green-600 font-medium py-1">✓ Review submitted</span>
        )}
      </div>
    </div>
  );
}
