import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import type { Booking, User, ServiceOffering } from '../types';
import { formatDisplayDate, formatTime } from '../utils/dateHelpers';
import { formatCents } from '../utils/formatters';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';

interface ConfirmationState {
  booking: Booking;
  cleaner: User;
  service: ServiceOffering;
}

export default function BookingConfirmationPage() {
  const location = useLocation();
  const state = location.state as ConfirmationState | null;

  if (!state) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-700 mb-4">No booking details found</h2>
        <Link to="/browse"><Button variant="primary">Browse Cleaners</Button></Link>
      </div>
    );
  }

  const { booking, cleaner, service } = state;

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-5">
          <CheckCircle size={40} className="text-teal-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500">Your booking request has been sent to {cleaner.firstName}. You'll be notified once they confirm.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
          <Avatar src={cleaner.avatarUrl} firstName={cleaner.firstName} lastName={cleaner.lastName} size="lg" />
          <div>
            <p className="font-semibold text-gray-900 text-lg">{cleaner.firstName} {cleaner.lastName}</p>
            <p className="text-gray-500 text-sm">{service.label}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-teal-500 flex-shrink-0" />
            <span className="text-gray-500">Date:</span>
            <span className="font-medium text-gray-900">{formatDisplayDate(booking.scheduledDate)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock size={16} className="text-teal-500 flex-shrink-0" />
            <span className="text-gray-500">Time:</span>
            <span className="font-medium text-gray-900">{formatTime(booking.scheduledTime)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={16} className="text-teal-500 flex-shrink-0" />
            <span className="text-gray-500">Address:</span>
            <span className="font-medium text-gray-900">{booking.addressLine1}, {booking.city}</span>
          </div>
          <div className="flex items-center gap-3 text-sm pt-2 border-t border-gray-100">
            <DollarSign size={16} className="text-teal-500 flex-shrink-0" />
            <span className="text-gray-500">Amount Paid:</span>
            <span className="font-bold text-teal-700 text-base">{formatCents(booking.totalAmountCents)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/client/bookings" className="flex-1">
          <Button variant="primary" size="lg" className="w-full">View My Bookings</Button>
        </Link>
        <Link to="/browse" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">Find More Cleaners</Button>
        </Link>
      </div>
    </div>
  );
}
