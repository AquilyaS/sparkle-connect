import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import type { ServiceType, DayOfWeek } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import { getProfiles, saveProfiles } from '../../utils/storage';
import { getDayOrder, getDayFullName } from '../../utils/dateHelpers';
import Input, { TextArea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ALL_SERVICES: { type: ServiceType; label: string; defaultDuration: number; defaultPrice: number }[] = [
  { type: 'regular', label: 'Regular Cleaning', defaultDuration: 2, defaultPrice: 8000 },
  { type: 'deep_clean', label: 'Deep Clean', defaultDuration: 4, defaultPrice: 15000 },
  { type: 'move_in_out', label: 'Move In/Out', defaultDuration: 6, defaultPrice: 22000 },
  { type: 'office', label: 'Office Cleaning', defaultDuration: 3, defaultPrice: 12000 },
];

export default function CleanerProfileEdit() {
  const { currentUser } = useAuth();
  const { showToast } = useApp();

  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('40');
  const [yearsExp, setYearsExp] = useState('1');
  const [coverage, setCoverage] = useState('15');
  const [languages, setLanguages] = useState('English');
  const [insured, setInsured] = useState(false);
  const [bgChecked, setBgChecked] = useState(false);
  const [loading, setSaving] = useState(false);

  const [selectedServices, setSelectedServices] = useState<Record<ServiceType, boolean>>({
    regular: true, deep_clean: false, move_in_out: false, office: false,
  });
  const [servicePrices, setServicePrices] = useState<Record<ServiceType, string>>({
    regular: '80', deep_clean: '150', move_in_out: '220', office: '120',
  });

  const [availability, setAvailability] = useState<Record<DayOfWeek, { enabled: boolean; start: string; end: string }>>({
    mon: { enabled: true, start: '09:00', end: '17:00' },
    tue: { enabled: true, start: '09:00', end: '17:00' },
    wed: { enabled: true, start: '09:00', end: '17:00' },
    thu: { enabled: true, start: '09:00', end: '17:00' },
    fri: { enabled: true, start: '09:00', end: '17:00' },
    sat: { enabled: false, start: '10:00', end: '15:00' },
    sun: { enabled: false, start: '10:00', end: '15:00' },
  });

  useEffect(() => {
    if (!currentUser) return;
    const profile = getProfiles().find(p => p.userId === currentUser.id);
    if (!profile) return;
    setBio(profile.bio);
    setHourlyRate(String(profile.hourlyRate / 100));
    setYearsExp(String(profile.yearsExperience));
    setCoverage(String(profile.coverageAreaMiles));
    setLanguages(profile.languages.join(', '));
    setInsured(profile.insuranceCertified);
    setBgChecked(profile.backgroundChecked);

    const svcMap: Record<ServiceType, boolean> = { regular: false, deep_clean: false, move_in_out: false, office: false };
    const priceMap: Record<ServiceType, string> = { regular: '80', deep_clean: '150', move_in_out: '220', office: '120' };
    profile.servicesOffered.forEach(s => {
      svcMap[s.type] = true;
      priceMap[s.type] = String(s.basePrice / 100);
    });
    setSelectedServices(svcMap);
    setServicePrices(priceMap);

    const avail = { ...availability };
    getDayOrder().forEach(day => {
      const slot = profile.availability[day];
      avail[day] = slot ? { enabled: true, start: slot.start, end: slot.end } : { enabled: false, start: '09:00', end: '17:00' };
    });
    setAvailability(avail);
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));

    const profiles = getProfiles();
    const updated = profiles.map(p => {
      if (p.userId !== currentUser.id) return p;
      return {
        ...p,
        bio,
        yearsExperience: parseInt(yearsExp) || 0,
        hourlyRate: Math.round(parseFloat(hourlyRate) * 100) || p.hourlyRate,
        coverageAreaMiles: parseInt(coverage) || 15,
        languages: languages.split(',').map(l => l.trim()).filter(Boolean),
        insuranceCertified: insured,
        backgroundChecked: bgChecked,
        servicesOffered: ALL_SERVICES
          .filter(s => selectedServices[s.type])
          .map(s => ({
            type: s.type,
            label: s.label,
            durationHours: s.defaultDuration,
            basePrice: Math.round(parseFloat(servicePrices[s.type] || '0') * 100),
          })),
        availability: Object.fromEntries(
          getDayOrder().map(day => [
            day,
            availability[day].enabled ? { start: availability[day].start, end: availability[day].end } : null,
          ])
        ) as typeof p.availability,
      };
    });
    saveProfiles(updated);
    setSaving(false);
    showToast('Profile saved successfully!');
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Edit Profile</h1>

      <div className="space-y-6">
        {/* Bio */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About You</h2>
          <div className="space-y-4">
            <TextArea
              label="Bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell clients about your experience, approach, and what makes you great..."
              rows={4}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Input label="Hourly Rate ($)" type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} min="10" />
              <Input label="Years Experience" type="number" value={yearsExp} onChange={e => setYearsExp(e.target.value)} min="0" />
              <Input label="Coverage (miles)" type="number" value={coverage} onChange={e => setCoverage(e.target.value)} min="1" />
            </div>
            <Input label="Languages (comma-separated)" value={languages} onChange={e => setLanguages(e.target.value)} placeholder="English, Spanish" />
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h2>
          <div className="space-y-3">
            {ALL_SERVICES.map(s => (
              <div key={s.type} className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${selectedServices[s.type] ? 'border-teal-200 bg-teal-50' : 'border-gray-100 bg-gray-50'}`}>
                <input
                  type="checkbox"
                  id={`svc-${s.type}`}
                  checked={selectedServices[s.type]}
                  onChange={e => setSelectedServices(prev => ({ ...prev, [s.type]: e.target.checked }))}
                  className="w-4 h-4 accent-teal-600"
                />
                <label htmlFor={`svc-${s.type}`} className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">{s.label}</label>
                {selectedServices[s.type] && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">$</span>
                    <input
                      type="number"
                      value={servicePrices[s.type]}
                      onChange={e => setServicePrices(prev => ({ ...prev, [s.type]: e.target.value }))}
                      className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      min="0"
                      placeholder="Price"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
          <div className="space-y-3">
            {getDayOrder().map(day => (
              <div key={day} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${availability[day].enabled ? 'border-teal-200 bg-teal-50' : 'border-gray-100'}`}>
                <input
                  type="checkbox"
                  id={`avail-${day}`}
                  checked={availability[day].enabled}
                  onChange={e => setAvailability(prev => ({ ...prev, [day]: { ...prev[day], enabled: e.target.checked } }))}
                  className="w-4 h-4 accent-teal-600"
                />
                <label htmlFor={`avail-${day}`} className="w-24 text-sm font-medium text-gray-700 cursor-pointer">{getDayFullName(day)}</label>
                {availability[day].enabled && (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={availability[day].start}
                      onChange={e => setAvailability(prev => ({ ...prev, [day]: { ...prev[day], start: e.target.value } }))}
                      className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-gray-400 text-xs">to</span>
                    <input
                      type="time"
                      value={availability[day].end}
                      onChange={e => setAvailability(prev => ({ ...prev, [day]: { ...prev[day], end: e.target.value } }))}
                      className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={insured} onChange={e => setInsured(e.target.checked)} className="w-4 h-4 accent-teal-600" />
              <span className="text-sm font-medium text-gray-700">I am insurance certified</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={bgChecked} onChange={e => setBgChecked(e.target.checked)} className="w-4 h-4 accent-teal-600" />
              <span className="text-sm font-medium text-gray-700">I have passed a background check</span>
            </label>
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={handleSave} isLoading={loading} className="w-full">
          <Save size={16} />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
