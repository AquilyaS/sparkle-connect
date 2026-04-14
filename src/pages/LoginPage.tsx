import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../hooks/useApp';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const demoCredentials = [
  { label: 'Client (John)', email: 'john.doe@example.com', password: 'password123' },
  { label: 'Client (Lisa)', email: 'lisa.smith@example.com', password: 'password123' },
  { label: 'Cleaner (Sarah)', email: 'sarah.johnson@example.com', password: 'password123' },
];

export default function LoginPage() {
  const { login, currentUser } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = (location.state as { returnUrl?: string } | null)?.returnUrl;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    navigate(`/${currentUser.role}/dashboard`, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.firstName}!`);
      navigate(returnUrl ?? `/${user.role}/dashboard`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (cred: typeof demoCredentials[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-teal-700">
            <Sparkles size={24} className="text-teal-600" />
            CleanConnect
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-1">Welcome back</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                error={error}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => showToast('Password reset coming soon!', 'info')}
                className="text-xs text-teal-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">Try a demo account</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {demoCredentials.map(cred => (
              <button
                key={cred.email}
                type="button"
                onClick={() => fillDemo(cred)}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50 text-left transition-colors text-sm"
              >
                <span className="font-medium text-gray-700">{cred.label}</span>
                <span className="text-xs text-gray-400">{cred.email}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-600 font-medium hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
