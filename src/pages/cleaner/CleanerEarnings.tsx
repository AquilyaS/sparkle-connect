import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { getUsers } from '../../utils/storage';
import { formatCents } from '../../utils/formatters';
import { formatDisplayDate, getMonthLabel, isSameMonth } from '../../utils/dateHelpers';
import StatsCard from '../../components/dashboard/StatsCard';
import { DollarSign, TrendingUp, Briefcase } from 'lucide-react';

export default function CleanerEarnings() {
  const { currentUser } = useAuth();
  const { getCleanerBookings } = useBookings();

  if (!currentUser) return null;

  const allBookings = getCleanerBookings(currentUser.id);
  const users = getUsers();
  const completedBookings = allBookings.filter(b => b.status === 'completed');

  const totalEarnings = completedBookings.reduce((s, b) => s + b.totalAmountCents, 0);
  const thisMonthEarnings = completedBookings
    .filter(b => isSameMonth(b.scheduledDate, 0))
    .reduce((s, b) => s + b.totalAmountCents, 0);

  // Monthly data for last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const monthsAgo = 5 - i;
    const label = getMonthLabel(monthsAgo);
    const amount = completedBookings
      .filter(b => isSameMonth(b.scheduledDate, monthsAgo))
      .reduce((s, b) => s + b.totalAmountCents, 0);
    return { label, amount };
  });

  const maxAmount = Math.max(...monthlyData.map(m => m.amount), 1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Earnings</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Total Earned"
          value={formatCents(totalEarnings)}
          subtitle="All time"
          icon={<DollarSign size={22} />}
          colorClass="bg-green-100 text-green-700"
        />
        <StatsCard
          title="This Month"
          value={formatCents(thisMonthEarnings)}
          subtitle="Current month"
          icon={<TrendingUp size={22} />}
          colorClass="bg-teal-100 text-teal-700"
        />
        <StatsCard
          title="Jobs Completed"
          value={completedBookings.length}
          subtitle="Total bookings"
          icon={<Briefcase size={22} />}
          colorClass="bg-purple-100 text-purple-700"
        />
      </div>

      {/* Monthly Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Earnings</h2>
        <div className="flex items-end justify-around gap-3 h-48">
          {monthlyData.map(m => {
            const heightPct = maxAmount > 0 ? (m.amount / maxAmount) * 100 : 0;
            return (
              <div key={m.label} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs text-gray-500 font-medium">{formatCents(m.amount)}</span>
                <div
                  className="w-full rounded-t-lg bg-teal-500 transition-all duration-500 min-h-[4px]"
                  style={{ height: `${Math.max(heightPct, 2)}%` }}
                />
                <span className="text-xs text-gray-400">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Earnings</h2>
        {completedBookings.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No completed bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Service</th>
                  <th className="pb-3 pr-4">Client</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {completedBookings
                  .sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate))
                  .map(b => {
                    const client = users.find(u => u.id === b.clientId);
                    return (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-4 text-gray-700">{formatDisplayDate(b.scheduledDate)}</td>
                        <td className="py-3 pr-4 text-gray-600 capitalize">{b.serviceType.replace(/_/g, ' ')}</td>
                        <td className="py-3 pr-4 text-gray-600">{client?.firstName ?? '—'}</td>
                        <td className="py-3 text-right font-semibold text-teal-700">{formatCents(b.totalAmountCents)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
