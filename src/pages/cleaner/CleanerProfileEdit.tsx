import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, MapPin, DollarSign, CheckCircle2,
  BadgeCheck, ShieldCheck, ExternalLink,
} from 'lucide-react';
import type { DayOfWeek, ServiceType } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import { getProfiles, saveProfiles } from '../../utils/storage';
import { TextArea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80';

const SERVICE_OPTIONS: { type: ServiceType; emoji: string; label: string; price: number }[] = [
  { type: 'regular',          emoji: '🧹', label: 'Regular Clean',      price: 80  },
  { type: 'deep_clean',       emoji: '✨', label: 'Deep Clean',         price: 150 },
  { type: 'vacancy',          emoji: '🏠', label: 'Move-Out Clean',     price: 220 },
  { type: 'office',           emoji: '🏢', label: 'Office Clean',       price: 120 },
  { type: 'rental',           emoji: '🛎️', label: 'Short-Term Rental', price: 90  },
  { type: 'specialty',        emoji: '🌿', label: 'Specialty Clean',    price: 160 },
  { type: 'event',            emoji: '🎉', label: 'Event Clean',        price: 180 },
  { type: 'post_construction',emoji: '🔨', label: 'Post-Construction',  price: 300 },
];

export default function CleanerProfileEdit() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useApp();

  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [location, setLocation]     = useState('');
  const [bio, setBio]               = useState('');
  const [rate, setRate]             = useState('40');
  const [insured, setInsured]       = useState(false);
  const [bgChecked, setBgChecked]   = useState(false);
  const [services, setServices]     = useState<Set<ServiceType>>(new Set<ServiceType>(['regular', 'deep_clean']));
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setFirstName(currentUser.firstName);
    setLastName(currentUser.lastName);
    setLocation(currentUser.location);

    const profile = getProfiles().find(p => p.userId === currentUser.id);
    if (!profile) return;

    setBio(profile.bio);
    setRate(String(profile.hourlyRate / 100));
    setInsured(profile.insuranceCertified);
    setBgChecked(profile.backgroundChecked);
    setServices(new Set(profile.servicesOffered.map(s => s.type)));
  }, [currentUser]);

  if (!currentUser) return null;

  const toggleService = (type: ServiceType) => {
    setServices(prev => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !location.trim()) {
      showToast('Add your name and location to continue.', 'error');
      return;
    }
    if (services.size === 0) {
      showToast('Pick at least one service.', 'error');
      return;
    }
    if (!bio.trim()) {
      showToast('Add a short bio so clients know who you are.', 'error');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    updateCurrentUser({ firstName, lastName, location });

    const profiles = getProfiles();
    const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const availability = Object.fromEntries(
      days.map(d => [d, ['mon','tue','wed','thu','fri'].includes(d) ? { start: '09:00', end: '17:00' } : null])
    ) as Record<DayOfWeek, { start: string; end: string } | null>;

    const existing = profiles.find(p => p.userId === currentUser.id);
    const nextProfile = {
      userId: currentUser.id,
      bio,
      yearsExperience: existing?.yearsExperience ?? 0,
      servicesOffered: SERVICE_OPTIONS
        .filter(s => services.has(s.type))
        .map(s => ({
          type: s.type,
          label: s.label,
          durationHours: 2,
          basePrice: s.price * 100,
        })),
      hourlyRate: Math.round(Number(rate || '0') * 100),
      availability,
      coverageAreaMiles: 15,
      languages: ['English'],
      insuranceCertified: insured,
      backgroundChecked: bgChecked,
      averageRating: existing?.averageRating ?? 0,
      totalReviews: existing?.totalReviews ?? 0,
      totalJobsCompleted: existing?.totalJobsCompleted ?? 0,
      badges: existing?.badges ?? [],
    };

    saveProfiles(
      existing
        ? profiles.map(p => (p.userId === currentUser.id ? nextProfile : p))
        : [...profiles, nextProfile]
    );

    setLoading(false);
    setDone(true);
    showToast('Your profile is live! 🎉');
  };

  /* ── Success screen ── */
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">You're live! 🎉</h1>
          <p className="text-gray-500 mb-8">
            Clients in your area can now find and book you. Share your link to get your first booking faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/cleaners/${currentUser.id}`} className="flex-1">
              <Button variant="primary" size="lg" className="w-full">
                View My Profile <ExternalLink size={15} />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="flex-1" onClick={() => setDone(false)}>
              Edit Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main page ── */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Cleaning professional"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-teal-400/20 border border-teal-300/30 text-teal-100 text-sm font-medium px-3 py-1 rounded-full mb-3 w-fit">
            <Sparkles size={14} /> Your cleaner profile
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Get booked.<br />Get paid. ✨
          </h1>
          <p className="text-teal-100 mt-2 text-sm sm:text-base max-w-sm">
            Set up your profile in under 2 minutes — no CV, no stress.
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-6 pb-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Avatar + name */}
          <div className="px-6 pt-6 pb-5 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <Avatar
                src={currentUser.avatarUrl}
                firstName={firstName}
                lastName={lastName}
                size="xl"
              />
              <div className="flex-1 grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">First name</label>
                  <input
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Last name</label>
                  <input
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Smith"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition"
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <MapPin size={14} className="text-teal-400 flex-shrink-0" />
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Brooklyn, NY"
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-1">About you ✍️</p>
            <p className="text-xs text-gray-400 mb-3">2–3 sentences. What makes you great? What do clients love about you?</p>
            <TextArea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="I'm detail-obsessed and genuinely love leaving a space sparkling clean. Clients always say I'm reliable, friendly, and go the extra mile…"
              rows={3}
            />
          </div>

          {/* Services */}
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-1">What you offer 🧽</p>
            <p className="text-xs text-gray-400 mb-3">Tap the services you provide — clients filter by these.</p>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map(s => {
                const active = services.has(s.type);
                return (
                  <button
                    key={s.type}
                    type="button"
                    onClick={() => toggleService(s.type)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border transition-all ${
                      active
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-700'
                    }`}
                  >
                    <span>{s.emoji}</span> {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rate */}
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-1">Your hourly rate 💸</p>
            <p className="text-xs text-gray-400 mb-3">Start competitive — you can adjust anytime.</p>
            <div className="flex items-center gap-2 max-w-[160px]">
              <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/30 focus-within:border-teal-400">
                <span className="px-3 py-2 bg-gray-50 text-gray-400 text-sm border-r border-gray-200">
                  <DollarSign size={14} />
                </span>
                <input
                  type="number"
                  min="10"
                  value={rate}
                  onChange={e => setRate(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-900 focus:outline-none"
                  placeholder="40"
                />
              </div>
              <span className="text-sm text-gray-400">/ hr</span>
            </div>
          </div>

          {/* Trust signals */}
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-3">Trust badges 🛡️</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setInsured(v => !v)}
                className={`flex-1 flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                  insured ? 'border-teal-300 bg-teal-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <BadgeCheck size={20} className={insured ? 'text-teal-600' : 'text-gray-400'} />
                <div>
                  <p className={`text-sm font-medium ${insured ? 'text-teal-700' : 'text-gray-700'}`}>Insured</p>
                  <p className="text-xs text-gray-400">I carry liability insurance</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setBgChecked(v => !v)}
                className={`flex-1 flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                  bgChecked ? 'border-teal-300 bg-teal-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <ShieldCheck size={20} className={bgChecked ? 'text-teal-600' : 'text-gray-400'} />
                <div>
                  <p className={`text-sm font-medium ${bgChecked ? 'text-teal-700' : 'text-gray-700'}`}>Background Checked</p>
                  <p className="text-xs text-gray-400">Verified for client safety</p>
                </div>
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 py-6 bg-gradient-to-br from-teal-50 to-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">Ready to start getting booked?</p>
              <p className="text-xs text-gray-400 mt-0.5">Your profile goes live instantly — clients can find you right away.</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              isLoading={loading}
              className="whitespace-nowrap"
            >
              {loading ? 'Publishing…' : 'Go Live ✨'}
            </Button>
          </div>

        </div>

        {/* Preview link */}
        <div className="mt-4 text-center">
          <Link
            to={`/cleaners/${currentUser.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            <ExternalLink size={14} /> Preview your public profile
          </Link>
        </div>
      </div>
    </div>
  );
}
