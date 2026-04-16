import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Heart, Search, ArrowRight, User, Clock, XCircle, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { useApp } from '../../hooks/useApp';
import { getUsers } from '../../utils/storage';
import { formatDisplayDate, formatTime } from '../../utils/dateHelpers';
import { getServiceLabel, getStatusColorClasses, getStatusLabel } from '../../utils/formatters';
import StatsCard from '../../components/dashboard/StatsCard';
import BookingCard from '../../components/booking/BookingCard';
import Avatar from '../../components/ui/Avatar';

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

  // Recent activity: last 5 bookings by updatedAt
  const recentActivity = [...allBookings]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with profile shortcut */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {currentUser.firstName}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Manage your bookings and find new cleaners.</p>
        </div>
        <Link
          to="/client/profile"
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all text-sm font-medium text-gray-700"
        >
          <Avatar src={currentUser.avatarUrl} firstName={currentUser.firstName} lastName={currentUser.lastName} size="sm" />
          My Profile
        </Link>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming bookings */}
        <div className="lg:col-span-2">
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
            <div className="space-y-4">
              {upcomingBookings.slice(0, 3).map(booking => {
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

        {/* Recent Activity sidebar */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {recentActivity.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No activity yet.</p>
            ) : (
              recentActivity.map(b => {
                const cleaner = users.find(u => u.id === b.cleanerId);
                const statusIcon =
                  b.status === 'completed' ? <CheckCircle size={14} className="text-green-500" /> :
                  b.status === 'confirmed' ? <Star size={14} className="text-teal-500" /> :
                  b.status === 'cancelled' || b.status === 'declined' ? <XCircle size={14} className="text-red-400" /> :
                  <Clock size={14} className="text-yellow-500" />;
                return (
                  <div key={b.id} className="flex items-start gap-3 px-4 py-3">
                    {cleaner && <Avatar src={cleaner.avatarUrl} firstName={cleaner.firstName} lastName={cleaner.lastName} size="sm" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{getServiceLabel(b.serviceType)}</p>
                      <p className="text-xs text-gray-400">{cleaner?.firstName} · {formatDisplayDate(b.scheduledDate)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {statusIcon}
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${getStatusColorClasses(b.status)}`}>
                        {getStatusLabel(b.status)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { to: '/browse', icon: <Search size={22} className="text-teal-600" />, label: 'Book a Cleaner', desc: 'Find and book a professional' },
            { to: '/client/favorites', icon: <Heart size={22} className="text-red-500" />, label: 'My Favorites', desc: 'View saved cleaners' },
            { to: '/client/bookings', icon: <Calendar size={22} className="text-blue-500" />, label: 'My Bookings', desc: 'Manage all bookings' },
            { to: '/client/profile', icon: <User size={22} className="text-purple-500" />, label: 'My Profile', desc: 'Update your details' },
          ].map(item => (
            <Link key={item.to} to={item.to} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-100 p-4 flex items-center gap-3 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
