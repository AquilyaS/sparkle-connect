import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Heart, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { useApp } from '../../hooks/useApp';
import { getUsers } from '../../utils/storage';
import StatsCard from '../../components/dashboard/StatsCard';
import BookingCard from '../../components/booking/BookingCard';

export default function ClientDashboard() {
  const { currentUser } = useAuth();
  const { getClientBookings } = useBookings();
  const { favorites } = useApp();

  if (!currentUser) return null;

  const allBookings = getClientBookings(currentUser.id);
  const users = getUsers();

  const upcomingBookings = allBookings
    .filter(b => b.status === 'pending' || b.status === 'confirmed')
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  const completedCount = allBookings.filter(b => b.status === 'completed').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {currentUser.firstName}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Manage your bookings and find new cleaners.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Upcoming Bookings"
          value={upcomingBookings.length}
          icon={<Calendar size={22} />}
          colorClass="bg-teal-100 text-teal-700"
        />
        <StatsCard
          title="Completed"
          value={completedCount}
          icon={<CheckCircle size={22} />}
          colorClass="bg-green-100 text-green-700"
        />
        <StatsCard
          title="Saved Cleaners"
          value={favorites.length}
          icon={<Heart size={22} />}
          colorClass="bg-red-100 text-red-600"
        />
      </div>

      {/* Upcoming bookings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h2>
          <Link to="/client/bookings" className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {upcomingBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No upcoming bookings.</p>
            <Link to="/browse">
              <button className="text-sm text-teal-600 font-medium hover:underline">Browse cleaners →</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingBookings.slice(0, 4).map(booking => {
              const cleaner = users.find(u => u.id === booking.cleanerId);
              if (!cleaner) return null;
              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  otherUser={cleaner}
                  userRole="client"
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/browse', icon: <Search size={22} className="text-teal-600" />, label: 'Book a Cleaner', desc: 'Find and book a cleaning professional' },
            { to: '/client/favorites', icon: <Heart size={22} className="text-red-500" />, label: 'My Favorites', desc: 'View your saved cleaners' },
            { to: '/client/bookings', icon: <Calendar size={22} className="text-blue-500" />, label: 'My Bookings', desc: 'View and manage all bookings' },
          ].map(item => (
            <Link key={item.to} to={item.to} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-100 p-5 flex items-center gap-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
