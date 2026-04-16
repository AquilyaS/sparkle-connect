import { useState } from 'react';
import { Save, Lock, User, Phone, MapPin, Mail, Camera, CheckCircle } from 'lucide-react';
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
  const [phone, setPhone] = useState(currentUser?.phone ?? '');
  const [location, setLocation] = useState(currentUser?.location ?? '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPw, setSavingPw] = useState(false);
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  if (!currentUser) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!location.trim()) errs.location = 'Location is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    updateCurrentUser({ firstName: firstName.trim(), lastName: lastName.trim(), location: location.trim(), phone: phone.trim() || undefined });
    setSaving(false);
    showToast('Profile updated successfully!');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!currentPassword) errs.currentPassword = 'Enter your current password';
    else if (currentPassword !== currentUser.password) errs.currentPassword = 'Current password is incorrect';
    if (!newPassword) errs.newPassword = 'Enter a new password';
    else if (newPassword.length < 6) errs.newPassword = 'Must be at least 6 characters';
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwErrors({});
    setSavingPw(true);
    await new Promise(r => setTimeout(r, 400));
    updateCurrentUser({ password: newPassword });
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    setSavingPw(false);
    showToast('Password changed successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="space-y-6">

        {/* Avatar card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar src={currentUser.avatarUrl} firstName={firstName} lastName={lastName} size="xl" />
              <button
                type="button"
                onClick={() => showToast('Photo upload coming soon!', 'info')}
                className="absolute -bottom-1 -right-1 bg-teal-600 rounded-full p-1.5 hover:bg-teal-700 transition-colors"
              >
                <Camera size={13} className="text-white" />
              </button>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{firstName} {lastName}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <Mail size={13} /> {currentUser.email}
              </p>
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                <CheckCircle size={11} /> Verified Client
              </span>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User size={17} className="text-teal-600" /> Personal Information
          </h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} error={errors.firstName} placeholder="Jane" />
              <Input label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} error={errors.lastName} placeholder="Smith" />
            </div>
            <Input label="Email address" type="email" value={currentUser.email} disabled className="opacity-60 cursor-not-allowed" hint="Email cannot be changed" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} error={errors.location} placeholder="New York, NY" />
              <Input label="Phone (optional)" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" />
            </div>
            <Button type="submit" variant="primary" size="md" isLoading={saving}>
              <Save size={15} /> Save Changes
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock size={17} className="text-teal-600" /> Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} error={pwErrors.currentPassword} placeholder="••••••••" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} error={pwErrors.newPassword} placeholder="At least 6 characters" />
              <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} error={pwErrors.confirmPassword} placeholder="Repeat new password" />
            </div>
            <Button type="submit" variant="secondary" size="md" isLoading={savingPw}>
              <Lock size={15} /> Update Password
            </Button>
          </form>
        </div>

        {/* Account info */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 text-sm">
          <p className="font-semibold text-gray-700 mb-3">Account Details</p>
          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-gray-500">Member since</span>
            <span className="text-gray-800 font-medium">{new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
            <span className="text-gray-500">Account type</span>
            <span className="text-gray-800 font-medium capitalize">{currentUser.role}</span>
            <span className="text-gray-500">User ID</span>
            <span className="text-gray-400 font-mono text-xs truncate">{currentUser.id}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
