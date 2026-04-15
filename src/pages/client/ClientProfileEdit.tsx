import { useState } from 'react';
import { Save, User, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';

export default function ClientProfileEdit() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useApp();

  const [firstName, setFirstName] = useState(currentUser?.firstName ?? '');
  const [lastName, setLastName] = useState(currentUser?.lastName ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [phone, setPhone] = useState(currentUser?.phone ?? '');
  const [location, setLocation] = useState(currentUser?.location ?? '');
  const [saving, setSaving] = useState(false);

  if (!currentUser) return null;

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    updateCurrentUser({ firstName, lastName, email, phone: phone || undefined, location });
    setSaving(false);
    showToast('Profile updated successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="space-y-6">
        {/* Avatar & Name */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-5 mb-6">
            <Avatar src={currentUser.avatarUrl} firstName={firstName} lastName={lastName} size="xl" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{firstName} {lastName}</h2>
              <p className="text-sm text-gray-500">Member since {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="First name"
              icon={<User size={16} className="text-gray-400" />}
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Last name"
              icon={<User size={16} className="text-gray-400" />}
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h2>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              icon={<Mail size={16} className="text-gray-400" />}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              icon={<Phone size={16} className="text-gray-400" />}
            />
            <Input
              label="Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="City, State"
              icon={<MapPin size={16} className="text-gray-400" />}
            />
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={handleSave} isLoading={saving} className="w-full">
          <Save size={16} />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
