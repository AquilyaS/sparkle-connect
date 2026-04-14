import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, FileText, CreditCard, CheckCircle } from 'lucide-react';
import { getProfiles, getUsers } from '../utils/storage';
import type { ServiceType } from '../types';
import { generateNext28Days, getDayOfWeek, formatDisplayDate, formatShortDate, formatTime, generateTimeSlots } from '../utils/dateHelpers';
import { getServiceLabel, formatCents } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import { useApp } from '../hooks/useApp';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Input, { TextArea } from '../components/ui/Input';

const STEPS = ['Select Service & Time', 'Your Details', 'Confirm & Pay'];

export default function BookingPage() {
  const { cleanerId } = useParams<{ cleanerId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createBooking } = useBookings();
  const { showToast } = useApp();

  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState<ServiceType>('regular');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const profile = getProfiles().find(p => p.userId === cleanerId);
  const user = getUsers().find(u => u.id === cleanerId);

  if (!profile || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Cleaner not found.</p>
        <Link to="/browse"><Button variant="primary" className="mt-4">Browse Cleaners</Button></Link>
      </div>
    );
  }

  const selectedService = profile.servicesOffered.find(s => s.type === serviceType) ?? profile.servicesOffered[0];
  const next28Days = useMemo(() => generateNext28Days(), []);

  const isAvailableDate = (iso: string) => {
    const dow = getDayOfWeek(iso);
    return !!profile.availability[dow];
  };

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dow = getDayOfWeek(selectedDate);
    const slot = profile.availability[dow];
    if (!slot) return [];
    return generateTimeSlots(slot.start, slot.end);
  }, [selectedDate, profile]);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!selectedDate) e.date = 'Please select a date';
    if (!selectedTime) e.time = 'Please select a time';
    return e;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!address.trim()) e.address = 'Address is required';
    if (!city.trim()) e.city = 'City is required';
    return e;
  };

  const handleNext = () => {
    if (step === 0) {
      const e = validateStep1();
      if (Object.keys(e).length) { setErrors(e); return; }
    }
    if (step === 1) {
      const e = validateStep2();
      if (Object.keys(e).length) { setErrors(e); return; }
    }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const booking = await createBooking({
        clientId: currentUser!.id,
        cleanerId: user.id,
        serviceType,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        estimatedDurationHours: selectedService.durationHours,
        addressLine1: address,
        city,
        notes: notes.trim() || undefined,
        totalAmountCents: selectedService.basePrice,
      });
      showToast('Booking confirmed! 🎉');
      navigate('/booking-confirmation', { state: { booking, cleaner: user, service: selectedService } });
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate(`/cleaners/${cleanerId}`)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> {step > 0 ? 'Back' : 'Back to Profile'}
      </button>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${i < step ? 'bg-teal-600 text-white' : i === step ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {i < step ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className={`hidden sm:block text-sm font-medium ${i === step ? 'text-teal-700' : 'text-gray-400'}`}>{label}</span>
              {i < STEPS.length - 1 && <div className={`hidden sm:block w-12 h-0.5 ml-2 ${i < step ? 'bg-teal-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Select Service & Time</h2>

              {/* Service selector */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Service Type</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.servicesOffered.map(s => (
                    <button
                      key={s.type}
                      type="button"
                      onClick={() => setServiceType(s.type)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${serviceType === s.type ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div>
                        <p className={`font-medium text-sm ${serviceType === s.type ? 'text-teal-700' : 'text-gray-800'}`}>{s.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.durationHours}h est.</p>
                      </div>
                      <span className={`font-bold text-sm ${serviceType === s.type ? 'text-teal-700' : 'text-gray-700'}`}>{formatCents(s.basePrice)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date selector */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  <Calendar size={14} className="inline mr-1 text-teal-500" />
                  Select Date
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {next28Days.map(iso => {
                    const available = isAvailableDate(iso);
                    const selected = selectedDate === iso;
                    const [, , dayNum] = iso.split('-');
                    const dow = getDayOfWeek(iso);
                    const shortDow = dow.charAt(0).toUpperCase() + dow.slice(1, 3);
                    return (
                      <button
                        key={iso}
                        type="button"
                        disabled={!available}
                        onClick={() => { setSelectedDate(iso); setSelectedTime(''); }}
                        className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs font-medium transition-all border ${
                          !available ? 'opacity-30 cursor-not-allowed bg-gray-50 border-gray-100' :
                          selected ? 'bg-teal-600 text-white border-teal-600 shadow-sm' :
                          'bg-white border-gray-200 hover:border-teal-400 hover:bg-teal-50 text-gray-700'
                        }`}
                      >
                        <span className="text-xs opacity-75">{shortDow}</span>
                        <span className="text-base font-bold">{dayNum}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
              </div>

              {/* Time selector */}
              {selectedDate && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    <Clock size={14} className="inline mr-1 text-teal-500" />
                    Select Time — {formatShortDate(selectedDate)}
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableSlots.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 px-1 rounded-lg text-xs font-medium border transition-all ${
                          selectedTime === t ? 'bg-teal-600 text-white border-teal-600' : 'bg-white border-gray-200 hover:border-teal-400 text-gray-700'
                        }`}
                      >
                        {formatTime(t)}
                      </button>
                    ))}
                  </div>
                  {errors.time && <p className="text-xs text-red-600 mt-1">{errors.time}</p>}
                </div>
              )}

              <Button variant="primary" size="lg" onClick={handleNext} className="w-full">
                Continue <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Details</h2>
              <Input
                label="Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="123 Main St, Apt 4B"
                error={errors.address}
              />
              <Input
                label="City"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="New York"
                error={errors.city}
              />
              <TextArea
                label="Notes (optional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special instructions, access codes, pets, allergies..."
                rows={4}
              />
              <Button variant="primary" size="lg" onClick={handleNext} className="w-full">
                Continue <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">Confirm & Pay</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium text-gray-900">{getServiceLabel(serviceType)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Date & Time</span>
                  <span className="font-medium text-gray-900">{formatDisplayDate(selectedDate)} at {formatTime(selectedTime)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Address</span>
                  <span className="font-medium text-gray-900 text-right">{address}, {city}</span>
                </div>
                {notes && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Notes</span>
                    <span className="font-medium text-gray-900 text-right max-w-xs">{notes}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 bg-teal-50 px-3 rounded-xl">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-teal-700 text-lg">{formatCents(selectedService.basePrice)}</span>
                </div>
              </div>

              {/* Mock payment */}
              <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 bg-gray-50">
                <CreditCard size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">•••• •••• •••• 4242</p>
                  <p className="text-xs text-gray-400">Visa — Demo card</p>
                </div>
              </div>

              <Button variant="primary" size="lg" onClick={handleConfirm} isLoading={loading} className="w-full">
                {loading ? 'Processing...' : `Pay ${formatCents(selectedService.basePrice)}`}
              </Button>
              <p className="text-xs text-center text-gray-400">Demo mode — no real payment will be charged</p>
            </div>
          )}
        </div>

        {/* Sidebar summary */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Booking Summary</h3>
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={user.avatarUrl} firstName={user.firstName} lastName={user.lastName} size="md" />
              <div>
                <p className="font-medium text-gray-900 text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.location}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span className="font-medium">{getServiceLabel(serviceType)}</span>
              </div>
              {selectedDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{formatShortDate(selectedDate)}</span>
                </div>
              )}
              {selectedTime && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">{formatTime(selectedTime)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-teal-700">{formatCents(selectedService.basePrice)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
