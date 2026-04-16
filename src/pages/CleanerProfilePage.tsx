import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, Shield, Star, Clock, Briefcase, Globe, ArrowLeft, Heart, CalendarCheck, MessageCircle, Send } from 'lucide-react';
import { getProfiles, getUsers, getReviews } from '../utils/storage';
import type { CleanerListing } from '../types';
import { formatCentsShort, getBadgeLabel, getBadgeColorClasses, getServiceLabel } from '../utils/formatters';
import { getDayOrder, getDayFullName } from '../utils/dateHelpers';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../hooks/useApp';
import Avatar from '../components/ui/Avatar';
import StarRating from '../components/ui/StarRating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { TextArea } from '../components/ui/Input';
import ReviewCard from '../components/reviews/ReviewCard';

export default function CleanerProfilePage() {
  const { cleanerId } = useParams<{ cleanerId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isFavorite, toggleFavorite, showToast } = useApp();
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMsg, setContactMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const profiles = getProfiles();
  const users = getUsers();
  const reviews = getReviews();

  const profile = profiles.find(p => p.userId === cleanerId);
  const user = users.find(u => u.id === cleanerId);

  if (!profile || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Cleaner not found</h2>
        <Link to="/browse"><Button variant="primary">Browse Cleaners</Button></Link>
      </div>
    );
  }

  const cleanerReviews = reviews
    .filter(r => r.cleanerId === cleanerId && r.isPublic)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const favorited = isFavorite(user.id);

  const handleSendMessage = async () => {
    if (!contactMsg.trim()) return;
    setSendingMsg(true);
    await new Promise(r => setTimeout(r, 500));
    setSendingMsg(false);
    setContactOpen(false);
    setContactMsg('');
    showToast(`Message sent to ${user.firstName}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="relative flex-shrink-0">
                <Avatar src={user.avatarUrl} firstName={user.firstName} lastName={user.lastName} size="xl" />
                {profile.backgroundChecked && (
                  <span className="absolute -bottom-1 -right-1 bg-teal-600 rounded-full p-1.5">
                    <ShieldCheck size={14} className="text-white" />
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                    <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                      <MapPin size={15} />
                      <span className="text-sm">{user.location}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(user.id)}
                    className="p-2 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors"
                    aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <Heart size={20} className={favorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <StarRating rating={profile.averageRating} size="md" />
                  <span className="font-semibold text-gray-800">{profile.averageRating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({profile.totalReviews} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.badges.map(badge => (
                    <span key={badge} className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColorClasses(badge)}`}>
                      {getBadgeLabel(badge)}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-teal-500" /> {profile.yearsExperience} years exp.</span>
                  <span className="flex items-center gap-1.5"><CalendarCheck size={14} className="text-teal-500" /> {profile.totalJobsCompleted} jobs</span>
                  <span className="flex items-center gap-1.5"><Globe size={14} className="text-teal-500" /> {profile.languages.join(', ')}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.insuranceCertified && (
                    <Badge color="green"><ShieldCheck size={11} className="mr-1" /> Insurance Certified</Badge>
                  )}
                  {profile.backgroundChecked && (
                    <Badge color="blue"><Shield size={11} className="mr-1" /> Background Checked</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              <div className="flex flex-col items-center text-center pb-4 sm:pb-0">
                <span className="text-2xl font-bold text-teal-700">{profile.averageRating.toFixed(1)}</span>
                <span className="text-xs text-gray-500 mt-0.5">Avg Rating</span>
              </div>
              <div className="flex flex-col items-center text-center pt-4 sm:pt-0 sm:pl-4">
                <span className="text-2xl font-bold text-gray-900">{profile.totalReviews}</span>
                <span className="text-xs text-gray-500 mt-0.5">Reviews</span>
              </div>
              <div className="flex flex-col items-center text-center pb-4 sm:pb-0 sm:pl-4">
                <span className="text-2xl font-bold text-gray-900">{profile.totalJobsCompleted}</span>
                <span className="text-xs text-gray-500 mt-0.5">Jobs Done</span>
              </div>
              <div className="flex flex-col items-center text-center pt-4 sm:pt-0 sm:pl-4">
                <span className="text-2xl font-bold text-gray-900">{profile.yearsExperience}</span>
                <span className="text-xs text-gray-500 mt-0.5">Yrs Experience</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Services & Pricing */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Services & Pricing</h2>
            <div className="space-y-3">
              {profile.servicesOffered.map(s => (
                <div key={s.type} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{s.label}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> Est. {s.durationHours} hour{s.durationHours !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-700">{formatCentsShort(s.basePrice)}</p>
                    <p className="text-xs text-gray-400">starting from</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">* Hourly rate: {formatCentsShort(profile.hourlyRate)}/hr</p>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {getDayOrder().map(day => {
                const slot = profile.availability[day];
                return (
                  <div key={day} className={`flex items-center justify-between p-3 rounded-xl ${slot ? 'bg-teal-50' : 'bg-gray-50'}`}>
                    <span className={`text-sm font-medium ${slot ? 'text-teal-800' : 'text-gray-400'}`}>{getDayFullName(day)}</span>
                    {slot ? (
                      <span className="text-xs font-medium text-teal-600">
                        {slot.start} – {slot.end}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Unavailable</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Reviews <span className="text-gray-400 font-normal">({cleanerReviews.length})</span>
              </h2>
              <div className="flex items-center gap-2">
                <StarRating rating={profile.averageRating} size="sm" />
                <span className="text-sm font-semibold text-gray-700">{profile.averageRating.toFixed(1)}</span>
              </div>
            </div>
            {cleanerReviews.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {cleanerReviews.map(review => {
                  const client = users.find(u => u.id === review.clientId);
                  if (!client) return null;
                  return <ReviewCard key={review.id} review={review} client={client} />;
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar src={user.avatarUrl} firstName={user.firstName} lastName={user.lastName} size="md" />
                <div>
                  <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm text-gray-600">{profile.averageRating.toFixed(1)} · {profile.totalReviews} reviews</span>
                  </div>
                </div>
              </div>

              <div className="text-center py-3 mb-4 bg-teal-50 rounded-xl">
                <span className="text-3xl font-bold text-teal-700">{formatCentsShort(profile.hourlyRate)}</span>
                <span className="text-gray-500">/hr</span>
              </div>

              <div className="space-y-2 mb-5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Coverage area</span>
                  <span className="font-medium text-gray-800">{profile.coverageAreaMiles} mi radius</span>
                </div>
                <div className="flex justify-between">
                  <span>Jobs completed</span>
                  <span className="font-medium text-gray-800">{profile.totalJobsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience</span>
                  <span className="font-medium text-gray-800">{profile.yearsExperience} years</span>
                </div>
              </div>

              {currentUser?.role === 'client' ? (
                <div className="space-y-3">
                  <Link to={`/book/${user.id}`}>
                    <Button variant="primary" size="lg" className="w-full">
                      Book Now
                    </Button>
                  </Link>
                  <Button variant="secondary" size="lg" className="w-full" onClick={() => setContactOpen(true)}>
                    <MessageCircle size={16} />
                    Contact {user.firstName}
                  </Button>
                </div>
              ) : currentUser?.role === 'cleaner' ? (
                <p className="text-xs text-center text-gray-400">Log in as a client to book</p>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" state={{ returnUrl: `/book/${user.id}` }}>
                    <Button variant="primary" size="lg" className="w-full">
                      Login to Book
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" size="lg" className="w-full">
                      <MessageCircle size={16} />
                      Send a Message
                    </Button>
                  </Link>
                </div>
              )}

              {!currentUser && (
                <p className="text-xs text-center text-gray-400 mt-3">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-teal-600 hover:underline">Sign up free</Link>
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Contact Modal */}
      <Modal
        isOpen={contactOpen}
        onClose={() => { setContactOpen(false); setContactMsg(''); }}
        title={`Message ${user.firstName}`}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Avatar src={user.avatarUrl} firstName={user.firstName} lastName={user.lastName} size="md" />
            <div>
              <p className="font-medium text-gray-900 text-sm">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.location}</p>
            </div>
          </div>
          <TextArea
            label="Your message"
            value={contactMsg}
            onChange={e => setContactMsg(e.target.value)}
            placeholder={`Hi ${user.firstName}, I'm interested in booking your services...`}
            rows={4}
          />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => { setContactOpen(false); setContactMsg(''); }} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSendMessage}
              isLoading={sendingMsg}
              disabled={!contactMsg.trim()}
              className="flex-1"
            >
              <Send size={15} />
              Send Message
            </Button>
          </div>
          <p className="text-xs text-center text-gray-400">Demo mode — message is simulated</p>
        </div>
      </Modal>
    </div>
  );
}
