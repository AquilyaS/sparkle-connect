import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Home, Briefcase } from 'lucide-react';
import type { UserRole } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../hooks/useApp';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function RegisterPage() {
  const { register, currentUser } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('client');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    navigate(`/${currentUser.role}/dashboard`, { replace: true });
    return null;
  }

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.location.trim()) e.location = 'Location is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const user = await register({ ...form, role });
      showToast(`Welcome to CleanConnect, ${user.firstName}!`);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-teal-700">
            <Sparkles size={24} className="text-teal-600" />
            CleanConnect
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-1">Create your account</h1>
          <p className="text-gray-500">Join thousands of happy clients and cleaners</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">I want to:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === 'client'
                    ? 'border-teal-600 bg-teal-50 text-teal-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <Home size={24} />
                <span className="text-sm font-semibold">Book a Cleaner</span>
                <span className="text-xs text-center opacity-75">Find & hire cleaning professionals</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('cleaner')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === 'cleaner'
                    ? 'border-teal-600 bg-teal-50 text-teal-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <Briefcase size={24} />
                <span className="text-sm font-semibold">Offer Services</span>
                <span className="text-xs text-center opacity-75">Join as a cleaning professional</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                placeholder="Jane"
                error={errors.firstName}
              />
              <Input
                label="Last Name"
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                placeholder="Smith"
                error={errors.lastName}
              />
            </div>
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="At least 6 characters"
              error={errors.password}
            />
            <Input
              label="Location"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="New York, NY"
              hint="Your city and state"
              error={errors.location}
            />
            <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
