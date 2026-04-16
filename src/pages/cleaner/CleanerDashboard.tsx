import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Clock, ArrowRight, User, TrendingUp, Briefcase } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { getUsers } from '../../utils/storage';
import { formatCents } from '../../utils/formatters';
import { isSameMonth } from '../../utils/dateHelpers';
import StatsCard from '../../components/dashboard/StatsCard';
import BookingCard from '../../components/booking/BookingCard';
import Avatar from '../../components/ui/Avatar';

export default function CleanerDashboard() {
  const { currentUser } = useAuth();
  const { getCleanerBookings } = useBookings();

  if (!currentUser) return null;

  const allBookings = getCleanerBookings(currentUser.id);
  const users = getUsers();

  const pendingBookings = allBookings
    .filter(b => b.status === 'pending')
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  const upcomingBookings = allBookings
    .filter(b => b.status === 'confirmed')
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  const thisMonthEarnings = allBookings
    .filter(b => b.status === 'completed' && isSameMonth(b.scheduledDate, 0))
    .reduce((sum, b) => sum + b.totalAmountCents, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Profile Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar
            src={currentUser.avatarUrl}
            firstName={currentUser.firstName}
            lastName={currentUser.lastName}
            size="lg"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back, {currentUser.firstName}! 👋
            </h1>
            <p className="text-gray-500 mt-0.5">Here's what's happening with your bookings.</p>
          </div>
        </div>
        <Link
          to="/cleaner/profile"
          className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 hover:border-teal-300 hover:bg-teal-50 text-gray-700 hover:text-teal-700 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          <User size={15} />
          Edit Profile
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Pending Requests"
          value={pendingBookings.length}
          subtitle="Awaiting your response"
          icon={<Clock size={22} />}
          colorClass="bg-yellow-100 text-yellow-700"
        />
        <StatsCard
          title="Upcoming Jobs"
          value={upcomingBookings.length}
          subtitle="Confirmed bookings"
          icon={<Calendar size={22} />}
          colorClass="bg-teal-100 text-teal-700"
        />
        <StatsCard
          title="This Month"
          value={formatCents(thisMonthEarnings)}
          subtitle="Earnings"
          icon={<DollarSign size={22} />}
          colorClass="bg-green-100 text-green-700"
        />
      </div>

      {/* Pending Requests */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Pending Requests
            {pendingBookings.length > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {pendingBookings.length}
              </span>
            )}
          </h2>
          <Link to="/cleaner/bookings" className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {pendingBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <Clock size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No pending requests right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBookings.slice(0, 4).map(booking => {
              const client = users.find(u => u.id === booking.clientId);
              if (!client) return null;
              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  otherUser={client}
                  userRole="cleaner"
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Jobs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Jobs
            {upcomingBookings.length > 0 && (
              <span className="ml-2 bg-teal-100 text-teal-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {upcomingBookings.length}
              </span>
            )}
          </h2>
          <Link to="/cleaner/bookings" className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {upcomingBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming jobs scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingBookings.slice(0, 2).map(booking => {
              const client = users.find(u => u.id === booking.clientId);
              if (!client) return null;
              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  otherUser={client}
                  userRole="cleaner"
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
          <Link
            to="/cleaner/bookings"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-100 p-5 transition-all flex items-start gap-4"
          >
            <div className="bg-teal-100 text-teal-700 p-2.5 rounded-xl flex-shrink-0">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1">View All Bookings</p>
              <p className="text-xs text-gray-500">Manage pending and upcoming jobs</p>
            </div>
          </Link>
          <Link
            to="/cleaner/profile"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-100 p-5 transition-all flex items-start gap-4"
          >
            <div className="bg-purple-100 text-purple-700 p-2.5 rounded-xl flex-shrink-0">
              <User size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1">Edit Profile</p>
              <p className="text-xs text-gray-500">Update your services and availability</p>
            </div>
          </Link>
          <Link
            to="/cleaner/earnings"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-100 p-5 transition-all flex items-start gap-4"
          >
            <div className="bg-green-100 text-green-700 p-2.5 rounded-xl flex-shrink-0">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1">View Earnings</p>
              <p className="text-xs text-gray-500">Track your income and performance</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
