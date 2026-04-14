import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { getUsers } from '../../utils/storage';
import { formatCents } from '../../utils/formatters';
import { isSameMonth } from '../../utils/dateHelpers';
import StatsCard from '../../components/dashboard/StatsCard';
import BookingCard from '../../components/booking/BookingCard';

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
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {currentUser.firstName}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your bookings.</p>
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
              <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">{pendingBookings.length}</span>
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

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/cleaner/bookings', label: 'View All Bookings', desc: 'Manage pending and upcoming jobs' },
            { to: '/cleaner/profile', label: 'Edit Profile', desc: 'Update your services and availability' },
            { to: '/cleaner/earnings', label: 'View Earnings', desc: 'Track your income and performance' },
          ].map(item => (
            <Link key={item.to} to={item.to} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-100 p-5 transition-all">
              <p className="font-semibold text-gray-900 text-sm mb-1">{item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
