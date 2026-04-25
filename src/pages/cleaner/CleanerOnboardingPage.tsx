import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Upload, Check, ChevronRight, ChevronLeft,
  Shield, Award, Camera, Star, Lightbulb, Share2, Eye,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import { getProfiles, saveProfiles } from '../../utils/storage';
import type { ServiceType, DayOfWeek, ServiceOffering } from '../../types';
import Input from '../../components/ui/Input';
import { TextArea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// ─── Types ───────────────────────────────────────────────────────────────────

type ExperienceLevel = 'beginner' | '1-3' | '3+';
type TimeOfDay = 'morning' | 'afternoon' | 'evening';

interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
  // Step 2
  selectedServices: ServiceType[];
  hourlyRate: string;
  fixedRate: string;
  // Step 3
  bio: string;
  experienceLevel: ExperienceLevel;
  // Step 4
  availableDays: DayOfWeek[];
  availableTimes: TimeOfDay[];
  // Step 5
  certifications: string;
  isInsured: boolean;
  isBackgroundChecked: boolean;
}

type StepErrors = Partial<Record<string, string>>;

// ─── Constants ───────────────────────────────────────────────────────────────

const SERVICE_OPTIONS: { type: ServiceType; label: string; durationHours: number }[] = [
  { type: 'regular', label: 'Regular Cleaning', durationHours: 2 },
  { type: 'deep_clean', label: 'Deep Cleaning', durationHours: 4 },
  { type: 'vacancy', label: 'Move-Out Cleaning', durationHours: 5 },
  { type: 'office', label: 'Office Cleaning', durationHours: 3 },
];

const WEEKDAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri'];
const WEEKENDS: DayOfWeek[] = ['sat', 'sun'];
const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
  fri: 'Fri', sat: 'Sat', sun: 'Sun',
};

const TIME_RANGES: Record<TimeOfDay, { start: string; end: string }> = {
  morning: { start: '07:00', end: '12:00' },
  afternoon: { start: '12:00', end: '17:00' },
  evening: { start: '17:00', end: '21:00' },
};

const TIPS = [
  'Add clear before & after photos',
  'Keep your pricing competitive',
  'Respond to booking requests quickly',
  'Write a detailed and friendly bio',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeTimeSlot(times: TimeOfDay[]): { start: string; end: string } {
  if (!times.length) return { start: '09:00', end: '17:00' };
  const starts = times.map(t => TIME_RANGES[t].start).sort();
  const ends = times.map(t => TIME_RANGES[t].end).sort();
  return { start: starts[0], end: ends[ends.length - 1] };
}

// ─── Step indicator ──────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <div key={n} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              n < current
                ? 'bg-teal-600 text-white'
                : n === current
                ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {n < current ? <Check size={14} /> : n}
          </div>
          {n < total && (
            <div
              className={`h-0.5 w-8 sm:w-12 transition-all ${
                n < current ? 'bg-teal-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
      <span className="ml-2 text-sm text-gray-400">Step {current} of {total}</span>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function CleanerOnboardingPage() {
  const { register, currentUser } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<StepErrors>({});
  const justRegistered = useRef(false);

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    selectedServices: [],
    hourlyRate: '',
    fixedRate: '',
    bio: '',
    experienceLevel: 'beginner',
    availableDays: [...WEEKDAYS],
    availableTimes: ['morning', 'afternoon'],
    certifications: '',
    isInsured: false,
    isBackgroundChecked: false,
  });

  // Redirect if already logged in (but not mid-registration)
  if (currentUser && !justRegistered.current) {
    navigate(`/${currentUser.role}/dashboard`, { replace: true });
    return null;
  }

  // ── Field helpers ──

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  function toggleService(type: ServiceType) {
    setForm(f => ({
      ...f,
      selectedServices: f.selectedServices.includes(type)
        ? f.selectedServices.filter(s => s !== type)
        : [...f.selectedServices, type],
    }));
  }

  function toggleDay(day: DayOfWeek) {
    setForm(f => ({
      ...f,
      availableDays: f.availableDays.includes(day)
        ? f.availableDays.filter(d => d !== day)
        : [...f.availableDays, day],
    }));
  }

  function toggleDayGroup(days: DayOfWeek[]) {
    const allSelected = days.every(d => form.availableDays.includes(d));
    setForm(f => ({
      ...f,
      availableDays: allSelected
        ? f.availableDays.filter(d => !days.includes(d))
        : [...new Set([...f.availableDays, ...days])],
    }));
  }

  function toggleTime(time: TimeOfDay) {
    setForm(f => ({
      ...f,
      availableTimes: f.availableTimes.includes(time)
        ? f.availableTimes.filter(t => t !== time)
        : [...f.availableTimes, time],
    }));
  }

  // ── Validation ──

  function validateStep(s: number): StepErrors {
    const e: StepErrors = {};
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = 'First name is required';
      if (!form.lastName.trim()) e.lastName = 'Last name is required';
      if (!form.email.trim()) e.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
      if (!form.password) e.password = 'Password is required';
      else if (form.password.length < 6) e.password = 'At least 6 characters';
      if (!form.location.trim()) e.location = 'Location is required';
    }
    if (s === 2) {
      if (!form.selectedServices.length) e.services = 'Select at least one service';
      if (!form.hourlyRate && !form.fixedRate) e.pricing = 'Enter a rate to continue';
      if (form.hourlyRate && isNaN(Number(form.hourlyRate))) e.hourlyRate = 'Enter a valid number';
      if (form.fixedRate && isNaN(Number(form.fixedRate))) e.fixedRate = 'Enter a valid number';
    }
    if (s === 3) {
      if (!form.bio.trim()) e.bio = 'Please write a short bio';
    }
    if (s === 4) {
      if (!form.availableDays.length) e.days = 'Select at least one day';
      if (!form.availableTimes.length) e.times = 'Select at least one time';
    }
    return e;
  }

  function handleNext() {
    const errs = validateStep(step);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    setErrors({});
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Final submit ──

  async function handleFinish() {
    justRegistered.current = true;
    setIsSubmitting(true);
    try {
      const user = await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        location: form.location.trim(),
        role: 'cleaner',
      });

      // Build servicesOffered from selections
      const hourlyCents = form.hourlyRate ? Math.round(parseFloat(form.hourlyRate) * 100) : 4000;
      const fixedCents = form.fixedRate ? Math.round(parseFloat(form.fixedRate) * 100) : 0;

      const servicesOffered: ServiceOffering[] = form.selectedServices.map(type => {
        const opt = SERVICE_OPTIONS.find(o => o.type === type)!;
        const basePrice = fixedCents || hourlyCents * opt.durationHours;
        return { type, label: opt.label, durationHours: opt.durationHours, basePrice };
      });

      // Build availability map from selected days & times
      const timeSlot = computeTimeSlot(form.availableTimes);
      const availability: Partial<Record<DayOfWeek, { start: string; end: string } | null>> = {};
      form.availableDays.forEach(day => { availability[day] = timeSlot; });

      // Build badges
      const badges: ('top_rated' | 'quick_responder' | 'verified' | 'eco_friendly')[] = [];
      if (form.isInsured || form.isBackgroundChecked) badges.push('verified');

      // Experience
      const yearsMap: Record<ExperienceLevel, number> = { beginner: 0, '1-3': 1, '3+': 4 };

      // Certifications
      const certifications = form.certifications
        ? form.certifications.split(',').map(c => c.trim()).filter(Boolean)
        : [];

      // Update the blank profile created by register()
      const profiles = getProfiles();
      const updatedProfiles = profiles.map(p => {
        if (p.userId !== user.id) return p;
        return {
          ...p,
          bio: form.bio.trim(),
          yearsExperience: yearsMap[form.experienceLevel],
          servicesOffered: servicesOffered.length ? servicesOffered : p.servicesOffered,
          hourlyRate: hourlyCents,
          availability,
          insuranceCertified: form.isInsured,
          backgroundChecked: form.isBackgroundChecked,
          badges,
          certifications,
        };
      });
      saveProfiles(updatedProfiles);

      showToast(`Welcome, ${user.firstName}! Your profile is live.`, 'success');
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      justRegistered.current = false;
      showToast((err as Error).message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SUCCESS SCREEN
  // ─────────────────────────────────────────────────────────────────────────

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle size={40} className="text-teal-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">Your profile is live!</h1>
          <p className="text-gray-500 text-lg mb-10">
            Clients can now find and book your services.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/cleaner/dashboard')}
            >
              <Eye size={18} />
              View My Profile
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                showToast('Profile link copied to clipboard!', 'success');
              }}
            >
              <Share2 size={18} />
              Share My Profile
            </Button>
          </div>

          <button
            onClick={() => setShowTips(v => !v)}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2 transition-colors"
          >
            {showTips ? 'Hide tips' : 'Tips to get your first booking'}
          </button>

          {showTips && (
            <div className="mt-6 bg-white rounded-2xl border border-teal-100 p-6 text-left shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-amber-500" />
                <h3 className="font-semibold text-gray-900">Get your first booking faster</h3>
              </div>
              <ul className="space-y-3">
                {TIPS.map(tip => (
                  <li key={tip} className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} className="text-teal-600" />
                    </div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // WIZARD
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-teal-700">
            <Sparkles size={20} className="text-teal-600" />
            CleanConnect
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Progress */}
          <StepIndicator current={step} total={5} />

          {/* ── STEP 1: Basic Info ── */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Let's start with the basics</h2>
              <p className="text-gray-500 mb-6">This helps clients know who you are.</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={e => set('firstName', e.target.value)}
                    error={errors.firstName}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Smith"
                    value={form.lastName}
                    onChange={e => set('lastName', e.target.value)}
                    error={errors.lastName}
                  />
                </div>
                <Input
                  label="Location"
                  placeholder="City, Province"
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  error={errors.location}
                />
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  error={errors.email}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  error={errors.password}
                />

                {/* Profile photo (simulated) */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Upload Profile Photo</label>
                  <button
                    type="button"
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center gap-2 text-gray-400 hover:border-teal-300 hover:bg-teal-50/40 transition-colors"
                  >
                    <Camera size={24} />
                    <span className="text-sm font-medium">Click to upload a photo</span>
                  </button>
                  <p className="text-xs text-gray-400">A clear photo helps build trust with clients.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Services & Pricing ── */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">What services do you offer?</h2>
              <p className="text-gray-500 mb-6">Select all that apply and set your rates.</p>

              <div className="space-y-2 mb-6">
                {SERVICE_OPTIONS.map(opt => {
                  const selected = form.selectedServices.includes(opt.type);
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => toggleService(opt.type)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left ${
                        selected
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium text-sm">{opt.label}</span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selected ? 'border-teal-600 bg-teal-600' : 'border-gray-300'
                        }`}
                      >
                        {selected && <Check size={11} className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.services && <p className="text-xs text-red-600 mb-4">{errors.services}</p>}

              {/* Pricing */}
              <p className="text-sm font-semibold text-gray-700 mb-3">Set your pricing</p>
              <div className="space-y-3">
                <Input
                  label="Hourly Rate ($)"
                  type="number"
                  placeholder="e.g. 25"
                  min="1"
                  value={form.hourlyRate}
                  onChange={e => set('hourlyRate', e.target.value)}
                  error={errors.hourlyRate}
                />
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <Input
                  label="Fixed Price per Job ($)"
                  type="number"
                  placeholder="e.g. 120"
                  min="1"
                  value={form.fixedRate}
                  onChange={e => set('fixedRate', e.target.value)}
                  error={errors.fixedRate}
                />
              </div>
              {errors.pricing && <p className="text-xs text-red-600 mt-2">{errors.pricing}</p>}
            </div>
          )}

          {/* ── STEP 3: About You ── */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Tell clients about yourself</h2>
              <p className="text-gray-500 mb-6">Share your experience and what makes you stand out.</p>

              <div className="space-y-4">
                <TextArea
                  label="Bio"
                  rows={5}
                  placeholder="I am a reliable cleaner with attention to detail. I specialize in deep cleaning and take pride in leaving every space spotless..."
                  value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                  error={errors.bio}
                />

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Experience Level</label>
                  <select
                    value={form.experienceLevel}
                    onChange={e => set('experienceLevel', e.target.value as ExperienceLevel)}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors hover:border-gray-400"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="1-3">1–3 years</option>
                    <option value="3+">3+ years</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Availability ── */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">When are you available?</h2>
              <p className="text-gray-500 mb-6">Let clients know when they can book you.</p>

              {/* Days */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Available days</p>

                {/* Quick-select buttons */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => toggleDayGroup(WEEKDAYS)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all ${
                      WEEKDAYS.every(d => form.availableDays.includes(d))
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    Weekdays
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleDayGroup(WEEKENDS)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all ${
                      WEEKENDS.every(d => form.availableDays.includes(d))
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    Weekends
                  </button>
                </div>

                {/* Individual day toggles */}
                <div className="flex gap-2 flex-wrap">
                  {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as DayOfWeek[]).map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`w-12 h-12 rounded-xl text-xs font-semibold border-2 transition-all ${
                        form.availableDays.includes(day)
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {DAY_LABELS[day]}
                    </button>
                  ))}
                </div>
                {errors.days && <p className="text-xs text-red-600 mt-2">{errors.days}</p>}
              </div>

              {/* Times */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Available times</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['morning', 'afternoon', 'evening'] as TimeOfDay[]).map(time => {
                    const selected = form.availableTimes.includes(time);
                    const labels: Record<TimeOfDay, { label: string; range: string }> = {
                      morning: { label: 'Morning', range: '7am – 12pm' },
                      afternoon: { label: 'Afternoon', range: '12pm – 5pm' },
                      evening: { label: 'Evening', range: '5pm – 9pm' },
                    };
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => toggleTime(time)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                          selected
                            ? 'border-teal-600 bg-teal-50 text-teal-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-sm font-semibold">{labels[time].label}</span>
                        <span className="text-xs opacity-70 mt-0.5">{labels[time].range}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.times && <p className="text-xs text-red-600 mt-2">{errors.times}</p>}
              </div>
            </div>
          )}

          {/* ── STEP 5: Build Trust ── */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Build trust with clients</h2>
              <p className="text-gray-500 mb-6">Profiles with photos and details get more bookings.</p>

              <div className="space-y-5">
                {/* Before/After Photos */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Upload Before & After Photos</label>
                  <button
                    type="button"
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center gap-2 text-gray-400 hover:border-teal-300 hover:bg-teal-50/40 transition-colors"
                  >
                    <Upload size={22} />
                    <span className="text-sm font-medium">Click to upload photos</span>
                  </button>
                  <p className="text-xs text-gray-400">Show examples of your work to stand out.</p>
                </div>

                {/* Certifications */}
                <Input
                  label="Certifications (optional)"
                  placeholder="e.g. WHMIS, Cleaning Certification"
                  value={form.certifications}
                  onChange={e => set('certifications', e.target.value)}
                  hint="Separate multiple certifications with commas."
                />

                {/* ID Verification */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">ID Verification (optional)</label>
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <Shield size={20} className="text-teal-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Verify your identity</p>
                      <p className="text-xs text-gray-400 mt-0.5">Verified profiles receive more trust from clients.</p>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-medium text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      Upload ID
                    </button>
                  </div>
                </div>

                {/* Trust badges */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Trusted badges</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'isInsured' as const, icon: <Shield size={18} />, label: 'Insured', desc: 'You carry liability insurance' },
                      { key: 'isBackgroundChecked' as const, icon: <Award size={18} />, label: 'Background Checked', desc: 'You have passed a background check' },
                    ].map(badge => {
                      const checked = form[badge.key];
                      return (
                        <button
                          key={badge.key}
                          type="button"
                          onClick={() => set(badge.key, !checked)}
                          className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left ${
                            checked
                              ? 'border-teal-600 bg-teal-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`flex items-center gap-2 ${checked ? 'text-teal-700' : 'text-gray-500'}`}>
                            {badge.icon}
                            <span className="text-sm font-semibold">{badge.label}</span>
                            {checked && <Check size={14} className="ml-auto text-teal-600" />}
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">{badge.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className={`flex gap-3 mt-8 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
            {step > 1 && (
              <Button variant="secondary" onClick={handleBack} disabled={isSubmitting}>
                <ChevronLeft size={16} />
                Back
              </Button>
            )}
            {step < 5 ? (
              <Button variant="primary" onClick={handleNext}>
                Next
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button variant="primary" onClick={handleFinish} isLoading={isSubmitting}>
                {isSubmitting ? 'Setting up your profile...' : 'Finish'}
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
