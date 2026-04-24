import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  DollarSign,
  ExternalLink,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DayOfWeek, ServiceType } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import { getProfiles, saveProfiles } from '../../utils/storage';
import Input, { TextArea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';

const ALL_SERVICES: { type: ServiceType; label: string; description: string; defaultDuration: number; defaultPrice: number }[] = [
  { type: 'regular', label: 'Regular cleaning', description: 'Weekly or bi-weekly home cleaning', defaultDuration: 2, defaultPrice: 8000 },
  { type: 'deep_clean', label: 'Deep cleaning', description: 'Detailed top-to-bottom refresh', defaultDuration: 4, defaultPrice: 15000 },
  { type: 'vacancy', label: 'Move-out cleaning', description: 'Turnover cleaning for empty homes', defaultDuration: 6, defaultPrice: 22000 },
  { type: 'office', label: 'Office cleaning', description: 'Recurring workplace cleaning', defaultDuration: 3, defaultPrice: 12000 },
  { type: 'rental', label: 'Short-term rental', description: 'Fast resets between guests', defaultDuration: 2, defaultPrice: 9000 },
  { type: 'post_construction', label: 'Post-construction', description: 'Dust, debris, and finish cleanup', defaultDuration: 8, defaultPrice: 30000 },
];

const stepLabels = [
  'Basic Info',
  'Services & Pricing',
  'About You',
  'Availability',
  'Trust Builders',
] as const;

const experienceOptions = [
  { value: 'beginner', label: 'Beginner', helper: 'Just getting started' },
  { value: '1-3', label: '1–3 years', helper: 'Steady hands-on experience' },
  { value: '3+', label: '3+ years', helper: 'Highly experienced professional' },
] as const;

const stepCards = [
  { icon: UserCircle2, title: 'Create your profile', text: 'Share the basics, choose your services, and set rates that work for you.' },
  { icon: CalendarDays, title: 'Get booked by clients', text: 'Show your availability clearly so nearby clients can book with confidence.' },
  { icon: DollarSign, title: 'Get paid', text: 'Turn your experience into repeat business with a profile built to convert.' },
] as const;

function getExperienceLevel(years: number) {
  if (years >= 3) return '3+' as const;
  if (years >= 1) return '1-3' as const;
  return 'beginner' as const;
}

function getYearsFromExperience(level: 'beginner' | '1-3' | '3+') {
  if (level === '3+') return 4;
  if (level === '1-3') return 2;
  return 0;
}

function getTimeRange(morning: boolean, afternoon: boolean, evening: boolean) {
  if (morning && afternoon && evening) return { start: '08:00', end: '20:00' };
  if (morning && afternoon) return { start: '08:00', end: '17:00' };
  if (afternoon && evening) return { start: '12:00', end: '20:00' };
  if (morning && evening) return { start: '08:00', end: '20:00' };
  if (morning) return { start: '08:00', end: '12:00' };
  if (afternoon) return { start: '12:00', end: '17:00' };
  if (evening) return { start: '17:00', end: '21:00' };
  return { start: '09:00', end: '17:00' };
}

function getTimeSelections(slots: Array<{ start: string; end: string }>) {
  if (!slots.length) {
    return { morning: true, afternoon: true, evening: false };
  }

  const morning = slots.some(slot => slot.start < '12:00');
  const afternoon = slots.some(slot => slot.start < '17:00' && slot.end > '12:00');
  const evening = slots.some(slot => slot.end > '17:00');

  return { morning, afternoon, evening };
}

export default function CleanerProfileEdit() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useApp();
  const learnMoreRef = useRef<HTMLElement | null>(null);

  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | '1-3' | '3+'>('beginner');
  const [pricingMode, setPricingMode] = useState<'hourly' | 'fixed'>('hourly');
  const [hourlyRate, setHourlyRate] = useState('40');
  const [insured, setInsured] = useState(false);
  const [bgChecked, setBgChecked] = useState(false);
  const [availabilityGroups, setAvailabilityGroups] = useState({
    weekdays: true,
    weekends: false,
    morning: true,
    afternoon: true,
    evening: false,
  });

  const [selectedServices, setSelectedServices] = useState<Record<ServiceType, boolean>>({
    regular: true,
    deep_clean: true,
    vacancy: false,
    office: false,
    specialty: false,
    event: false,
    rental: false,
    post_construction: false,
  });

  const [servicePrices, setServicePrices] = useState<Record<ServiceType, string>>({
    regular: '80',
    deep_clean: '150',
    vacancy: '220',
    office: '120',
    specialty: '160',
    event: '180',
    rental: '90',
    post_construction: '300',
  });

  useEffect(() => {
    if (!currentUser) return;

    setFirstName(currentUser.firstName);
    setLastName(currentUser.lastName);
    setLocation(currentUser.location);

    const profile = getProfiles().find(item => item.userId === currentUser.id);
    if (!profile) return;

    setBio(profile.bio);
    setHourlyRate(String(profile.hourlyRate / 100));
    setExperienceLevel(getExperienceLevel(profile.yearsExperience));
    setInsured(profile.insuranceCertified);
    setBgChecked(profile.backgroundChecked);

    const serviceSelections: Record<ServiceType, boolean> = {
      regular: false,
      deep_clean: false,
      vacancy: false,
      office: false,
      specialty: false,
      event: false,
      rental: false,
      post_construction: false,
    };

    const servicePricing: Record<ServiceType, string> = {
      regular: '80',
      deep_clean: '150',
      vacancy: '220',
      office: '120',
      specialty: '160',
      event: '180',
      rental: '90',
      post_construction: '300',
    };

    profile.servicesOffered.forEach(service => {
      serviceSelections[service.type] = true;
      servicePricing[service.type] = String(service.basePrice / 100);
    });

    setSelectedServices(serviceSelections);
    setServicePrices(servicePricing);

    const weekdayEnabled = ['mon', 'tue', 'wed', 'thu', 'fri'].some(day => Boolean(profile.availability[day as DayOfWeek]));
    const weekendEnabled = ['sat', 'sun'].some(day => Boolean(profile.availability[day as DayOfWeek]));
    const timeSelections = getTimeSelections(
      Object.values(profile.availability).filter((slot): slot is { start: string; end: string } => Boolean(slot))
    );

    setAvailabilityGroups({
      weekdays: weekdayEnabled,
      weekends: weekendEnabled,
      morning: timeSelections.morning,
      afternoon: timeSelections.afternoon,
      evening: timeSelections.evening,
    });
  }, [currentUser]);

  if (!currentUser) return null;

  const selectedCount = Object.values(selectedServices).filter(Boolean).length;
  const progress = ((currentStep + 1) / stepLabels.length) * 100;

  const validateStep = () => {
    if (currentStep === 0) {
      if (!firstName.trim() || !lastName.trim() || !location.trim()) {
        showToast('Add your name and location to continue.', 'error');
        return false;
      }
    }

    if (currentStep === 1) {
      if (!selectedCount) {
        showToast('Choose at least one service to continue.', 'error');
        return false;
      }

      const invalidPrice = ALL_SERVICES
        .filter(service => selectedServices[service.type])
        .some(service => !servicePrices[service.type] || Number(servicePrices[service.type]) <= 0);

      if (invalidPrice) {
        showToast('Add a valid rate for each selected service.', 'error');
        return false;
      }
    }

    if (currentStep === 2 && !bio.trim()) {
      showToast('Write a short bio so clients know why to choose you.', 'error');
      return false;
    }

    if (currentStep === 3) {
      if (!availabilityGroups.weekdays && !availabilityGroups.weekends) {
        showToast('Select when clients can book you.', 'error');
        return false;
      }
      if (!availabilityGroups.morning && !availabilityGroups.afternoon && !availabilityGroups.evening) {
        showToast('Choose at least one time window.', 'error');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep(step => Math.min(step + 1, stepLabels.length - 1));
  };

  const handleSave = async () => {
    if (!validateStep()) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));

    updateCurrentUser({ firstName, lastName, location });

    const profiles = getProfiles();
    const timeRange = getTimeRange(
      availabilityGroups.morning,
      availabilityGroups.afternoon,
      availabilityGroups.evening,
    );

    const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const availability = Object.fromEntries(
      days.map(day => {
        const isWeekday = ['mon', 'tue', 'wed', 'thu', 'fri'].includes(day);
        const enabled = isWeekday ? availabilityGroups.weekdays : availabilityGroups.weekends;
        return [day, enabled ? timeRange : null];
      })
    ) as Record<DayOfWeek, { start: string; end: string } | null>;

    const nextProfile = {
      userId: currentUser.id,
      bio,
      yearsExperience: getYearsFromExperience(experienceLevel),
      servicesOffered: ALL_SERVICES
        .filter(service => selectedServices[service.type])
        .map(service => ({
          type: service.type,
          label: service.label,
          durationHours: service.defaultDuration,
          basePrice: Math.round(Number(servicePrices[service.type]) * 100),
        })),
      hourlyRate: Math.round(Number(hourlyRate || '0') * 100),
      availability,
      coverageAreaMiles: 15,
      languages: ['English'],
      insuranceCertified: insured,
      backgroundChecked: bgChecked,
      averageRating: profiles.find(profile => profile.userId === currentUser.id)?.averageRating ?? 0,
      totalReviews: profiles.find(profile => profile.userId === currentUser.id)?.totalReviews ?? 0,
      totalJobsCompleted: profiles.find(profile => profile.userId === currentUser.id)?.totalJobsCompleted ?? 0,
      badges: profiles.find(profile => profile.userId === currentUser.id)?.badges ?? [],
    };

    const hasExistingProfile = profiles.some(profile => profile.userId === currentUser.id);
    saveProfiles(
      hasExistingProfile
        ? profiles.map(profile => (profile.userId === currentUser.id ? nextProfile : profile))
        : [...profiles, nextProfile]
    );

    setLoading(false);
    setCompleted(true);
    showToast('Your cleaner profile is live!');
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/cleaners/${currentUser.id}`;

    if (navigator.share) {
      await navigator.share({
        title: `${firstName} ${lastName} on CleanConnect`,
        text: 'Check out my cleaner profile on CleanConnect.',
        url: shareUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    showToast('Profile link copied to clipboard!');
  };

  if (completed) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Your profile is live! 🎉</h1>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">
            You’re ready to start attracting cleaning clients with a profile that feels polished, trustworthy, and bookable.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link to={`/cleaners/${currentUser.id}`}>
              <Button variant="primary" size="lg" className="w-full">
                View My Profile
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="w-full" onClick={handleShare}>
              Share Profile
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={() => showToast('Tip: complete your bio and add trust signals to increase bookings.')}
            >
              Tips to get booked
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium mb-5">
                <Sparkles size={16} />
                Cleaner opportunity
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight max-w-2xl">
                Start getting cleaning clients in your area
              </h1>
              <p className="text-lg text-gray-500 mt-4 max-w-2xl">
                Create your profile, set your rates, and get booked—on your terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button variant="primary" size="lg" onClick={() => setStarted(true)}>
                  Create My Profile
                  <ArrowRight size={16} />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => learnMoreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-100 p-8 sm:p-10 flex items-center">
              <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar
                    src={currentUser.avatarUrl}
                    firstName={currentUser.firstName}
                    lastName={currentUser.lastName}
                    size="xl"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Cleaner spotlight</p>
                    <h2 className="text-xl font-semibold text-gray-900">{firstName || currentUser.firstName} {lastName || currentUser.lastName}</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {location || 'Your local area'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500 mb-1">Profile setup</p>
                    <p className="text-2xl font-semibold text-gray-900">5 steps</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500 mb-1">Built for</p>
                    <p className="text-2xl font-semibold text-gray-900">Fast trust</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-teal-50 p-4 border border-teal-100">
                  <p className="text-sm text-teal-800 font-medium">
                    Designed to feel quick, empowering, and not overwhelming—more like setting up a social profile than filling out a job application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={learnMoreRef} className="mt-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-teal-700 mb-2">How it works</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Simple, achievable, and built to reduce friction</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {stepCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>
                  <p className="text-sm text-gray-400 mb-2">0{index + 1}</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-6">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 sm:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm font-medium text-teal-700 mb-2">Cleaner profile setup</p>
              <h1 className="text-3xl font-bold text-gray-900">Build a profile that gets booked</h1>
              <p className="text-gray-500 mt-2">
                Complete one short step at a time so clients can trust you quickly.
              </p>
            </div>
            <div className="lg:w-72">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Step {currentStep + 1} of {stepLabels.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
            {stepLabels.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => index <= currentStep && setCurrentStep(index)}
                className={`text-left rounded-2xl border px-4 py-3 transition-colors ${
                  index === currentStep
                    ? 'border-teal-200 bg-teal-50 text-teal-700'
                    : index < currentStep
                      ? 'border-gray-200 bg-white text-gray-700'
                      : 'border-gray-100 bg-gray-50 text-gray-400'
                }`}
              >
                <p className="text-xs mb-1">0{index + 1}</p>
                <p className="text-sm font-medium leading-5">{label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {currentStep === 0 && (
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-start">
              <div className="rounded-3xl bg-gray-50 border border-gray-100 p-6">
                <div className="relative inline-flex mb-5">
                  <Avatar src={currentUser.avatarUrl} firstName={firstName} lastName={lastName} size="xl" />
                  <button
                    type="button"
                    onClick={() => showToast('Photo upload coming soon')}
                    className="absolute -bottom-1 -right-1 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-2 shadow transition-colors"
                    aria-label="Upload profile photo"
                  >
                    <Camera size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Make a strong first impression</h2>
                <p className="text-gray-500 text-sm leading-6">
                  Add the basics so nearby clients instantly understand who you are and where you work.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="First name" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" />
                  <Input label="Last name" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith" />
                </div>
                <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Brooklyn, NY" hint="Your city and area help clients discover you." />
                <button
                  type="button"
                  onClick={() => showToast('Photo upload coming soon')}
                  className="w-full rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-left hover:border-teal-300 hover:bg-teal-50 transition-colors"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Camera size={16} />
                    Add profile photo
                  </span>
                  <p className="text-sm text-gray-500 mt-2">A friendly, professional photo increases trust.</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Services & pricing</h2>
                  <p className="text-gray-500 text-sm">Choose what you offer and use the suggested rates to get started faster.</p>
                </div>
                <div className="inline-flex rounded-2xl bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setPricingMode('hourly')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${pricingMode === 'hourly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                  >
                    Hourly rates
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingMode('fixed')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${pricingMode === 'fixed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                  >
                    Fixed rates
                  </button>
                </div>
              </div>

              {pricingMode === 'hourly' && (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 max-w-sm">
                  <Input label="Suggested hourly rate ($)" type="number" min="10" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} hint="Start with a competitive rate and refine later." />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {ALL_SERVICES.map(service => (
                  <label
                    key={service.type}
                    className={`rounded-2xl border p-4 transition-colors cursor-pointer ${selectedServices[service.type] ? 'border-teal-200 bg-teal-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedServices[service.type]}
                        onChange={e => setSelectedServices(prev => ({ ...prev, [service.type]: e.target.checked }))}
                        className="mt-1 w-4 h-4 accent-teal-600"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold text-gray-900">{service.label}</p>
                            <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">Suggested ${service.defaultPrice / 100}</span>
                        </div>
                        {selectedServices[service.type] && (
                          <div className="mt-4 max-w-[170px]">
                            <Input
                              label={pricingMode === 'hourly' ? 'Rate ($)' : 'Fixed price ($)'}
                              type="number"
                              min="10"
                              value={servicePrices[service.type]}
                              onChange={e => setServicePrices(prev => ({ ...prev, [service.type]: e.target.value }))}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Tell clients why they should choose you</h2>
                <p className="text-gray-500 text-sm mb-5">
                  Keep it warm and specific—your experience, reliability, and what kind of homes or clients you love working with.
                </p>
                <TextArea
                  label="Short bio"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="I’m dependable, detail-focused, and known for leaving spaces fresh, organized, and guest-ready..."
                  rows={7}
                />
              </div>

              <div className="rounded-3xl bg-gray-50 border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience level</h3>
                <div className="space-y-3">
                  {experienceOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setExperienceLevel(option.value)}
                      className={`w-full text-left rounded-2xl border p-4 transition-colors ${experienceLevel === option.value ? 'border-teal-200 bg-teal-50' : 'border-gray-200 bg-white'}`}
                    >
                      <p className="font-medium text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-500 mt-1">{option.helper}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Set your availability</h2>
                <p className="text-gray-500 text-sm">Keep this simple—just tell clients when you usually work.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-3xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                    <CalendarDays size={18} />
                    Days you work
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'weekdays', label: 'Weekdays' },
                      { key: 'weekends', label: 'Weekends' },
                    ].map(item => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setAvailabilityGroups(prev => ({ ...prev, [item.key]: !prev[item.key as 'weekdays' | 'weekends'] }))}
                        className={`rounded-2xl border px-4 py-5 text-left transition-colors ${availabilityGroups[item.key as 'weekdays' | 'weekends'] ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-gray-200 bg-white text-gray-600'}`}
                      >
                        <p className="font-medium">{item.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                    <Clock3 size={18} />
                    Times you prefer
                  </div>
                  <div className="grid gap-3">
                    {[
                      { key: 'morning', label: 'Morning', helper: '8am – 12pm' },
                      { key: 'afternoon', label: 'Afternoon', helper: '12pm – 5pm' },
                      { key: 'evening', label: 'Evening', helper: '5pm – 9pm' },
                    ].map(item => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setAvailabilityGroups(prev => ({ ...prev, [item.key]: !prev[item.key as 'morning' | 'afternoon' | 'evening'] }))}
                        className={`rounded-2xl border p-4 text-left transition-colors ${availabilityGroups[item.key as 'morning' | 'afternoon' | 'evening'] ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-gray-200 bg-white text-gray-600'}`}
                      >
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm opacity-75 mt-1">{item.helper}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Trust builders</h2>
                <p className="text-gray-500 text-sm">
                  Trust is the foundation of the platform, so encourage clients to choose you by showcasing your work and credibility.
                </p>
              </div>

              <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6">
                <div className="rounded-3xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                    <ImagePlus size={18} />
                    Before & after photos
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Photo portfolio uploads are coming soon.')}
                    className="w-full rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 hover:border-teal-300 hover:bg-teal-50 transition-colors"
                  >
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                      <ImagePlus size={16} />
                      Upload before/after photos
                    </span>
                    <p className="text-sm text-gray-500 mt-2">Show the quality of your work visually.</p>
                  </button>
                </div>

                <div className="rounded-3xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                    <ShieldCheck size={18} />
                    Credibility signals
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 cursor-pointer">
                      <input type="checkbox" checked={insured} onChange={e => setInsured(e.target.checked)} className="mt-1 w-4 h-4 accent-teal-600" />
                      <div>
                        <p className="font-medium text-gray-900">Add certifications</p>
                        <p className="text-sm text-gray-500 mt-1">Optional, but helpful if you have insurance or training.</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 cursor-pointer">
                      <input type="checkbox" checked={bgChecked} onChange={e => setBgChecked(e.target.checked)} className="mt-1 w-4 h-4 accent-teal-600" />
                      <div>
                        <p className="font-medium text-gray-900">Background check ready</p>
                        <p className="text-sm text-gray-500 mt-1">Perfect for a later verification step and stronger trust.</p>
                      </div>
                    </label>
                    <div className="rounded-2xl bg-teal-50 border border-teal-100 p-4">
                      <div className="flex items-start gap-2 text-teal-800">
                        <BadgeCheck size={18} className="mt-0.5" />
                        <p className="text-sm font-medium">Profiles with strong trust signals tend to convert better.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button variant="ghost" size="lg" onClick={() => (currentStep === 0 ? setStarted(false) : setCurrentStep(step => Math.max(step - 1, 0)))}>
              {currentStep === 0 ? 'Back' : 'Previous step'}
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link to={`/cleaners/${currentUser.id}`} className="inline-flex">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Preview Profile
                  <ExternalLink size={15} />
                </Button>
              </Link>
              {currentStep < stepLabels.length - 1 ? (
                <Button variant="primary" size="lg" onClick={handleNext}>
                  Next step
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <Button variant="primary" size="lg" onClick={handleSave} isLoading={loading}>
                  Publish Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
