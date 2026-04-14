import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { getUsers } from '../../utils/storage';
import BookingCard from '../../components/booking/BookingCard';

const TABS = ['Pending', 'Confirmed', 'Completed', 'Declined'];

export default function CleanerBookings() {
  const { currentUser } = useAuth();
  const { getCleanerBookings } = useBookings();
  const [activeTab, setActiveTab] = useState(0);

  if (!currentUser) return null;

  const allBookings = getCleanerBookings(currentUser.id);
  const users = getUsers();

  const tabBookings = [
    allBookings.filter(b => b.status === 'pending').sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)),
    allBookings.filter(b => b.status === 'confirmed').sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)),
    allBookings.filter(b => b.status === 'completed').sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate)),
    allBookings.filter(b => b.status === 'declined' || b.status === 'cancelled').sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate)),
  ];

  const currentBookings = tabBookings[activeTab];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === i ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
            <span className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${activeTab === i ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-500'}`}>
              {tabBookings[i].length}
            </span>
          </button>
        ))}
      </div>

      {currentBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Calendar size={40} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No {TABS[activeTab].toLowerCase()} bookings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentBookings.map(booking => {
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
  );
}
