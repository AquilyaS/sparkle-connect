import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { getUsers } from '../../utils/storage';
import BookingCard from '../../components/booking/BookingCard';
import Modal from '../../components/ui/Modal';
import StarRating from '../../components/ui/StarRating';
import Button from '../../components/ui/Button';
import { TextArea } from '../../components/ui/Input';
import { useApp } from '../../hooks/useApp';

const TABS = ['Upcoming', 'Past'];

export default function ClientBookings() {
  const { currentUser } = useAuth();
  const { getClientBookings, submitReview } = useBookings();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState(0);
  const [reviewModal, setReviewModal] = useState<{ bookingId: string } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) return null;

  const allBookings = getClientBookings(currentUser.id);
  const users = getUsers();

  const upcomingBookings = allBookings
    .filter(b => b.status === 'pending' || b.status === 'confirmed')
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  const pastBookings = allBookings
    .filter(b => ['completed', 'cancelled', 'declined'].includes(b.status))
    .sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate));

  const currentBookings = activeTab === 0 ? upcomingBookings : pastBookings;

  const handleReviewSubmit = async () => {
    if (!reviewModal || !comment.trim()) return;
    setSubmitting(true);
    try {
      await submitReview(reviewModal.bookingId, rating, comment);
      showToast('Review submitted! Thank you.');
      setReviewModal(null);
      setRating(5);
      setComment('');
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === i ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
            <span className={`ml-2 text-xs rounded-full px-1.5 py-0.5 ${activeTab === i ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-500'}`}>
              {(i === 0 ? upcomingBookings : pastBookings).length}
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
            const cleaner = users.find(u => u.id === booking.cleanerId);
            if (!cleaner) return null;
            return (
              <BookingCard
                key={booking.id}
                booking={booking}
                otherUser={cleaner}
                userRole="client"
                onReview={bookingId => { setReviewModal({ bookingId }); setRating(5); setComment(''); }}
              />
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewModal}
        onClose={() => setReviewModal(null)}
        title="Leave a Review"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Your Rating</p>
            <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          </div>
          <TextArea
            label="Your Comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this cleaner..."
            rows={4}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setReviewModal(null)} className="flex-1">Cancel</Button>
            <Button
              variant="primary"
              onClick={handleReviewSubmit}
              isLoading={submitting}
              disabled={!comment.trim()}
              className="flex-1"
            >
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
