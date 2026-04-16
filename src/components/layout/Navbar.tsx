import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, ChevronDown, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = currentUser ? `/${currentUser.role}/dashboard` : '/login';

  return (
    <header className={`sticky top-0 z-40 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-teal-700 hover:text-teal-600 transition-colors">
            <Sparkles size={22} className="text-teal-600" />
            CleanConnect
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/browse" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
              Browse Cleaners
            </Link>
            <a href="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
              How It Works
            </a>
            <a href="/#services" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
              Services
            </a>
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Avatar
                    src={currentUser.avatarUrl}
                    firstName={currentUser.firstName}
                    lastName={currentUser.lastName}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-gray-700">{currentUser.firstName}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{currentUser.firstName} {currentUser.lastName}</p>
                      <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                    </div>
                    <Link to={dashboardPath} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    {currentUser.role === 'cleaner' && (
                      <Link to="/cleaner/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                        <UserIcon size={16} />
                        Edit Profile
                      </Link>
                    )}
                    {currentUser.role === 'client' && (
                      <Link to="/client/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                        <UserIcon size={16} />
                        My Profile
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            <Link to="/browse" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
              Browse Cleaners
            </Link>
            <a href="/#how-it-works" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
              How It Works
            </a>
            <a href="/#services" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
              Services
            </a>
            <div className="border-t border-gray-100 pt-3 mt-3">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <Avatar src={currentUser.avatarUrl} firstName={currentUser.firstName} lastName={currentUser.lastName} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{currentUser.firstName} {currentUser.lastName}</p>
                      <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                    </div>
                  </div>
                  <Link to={dashboardPath} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  {currentUser.role === 'client' && (
                    <Link to="/client/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                      <UserIcon size={16} />
                      My Profile
                    </Link>
                  )}
                  {currentUser.role === 'cleaner' && (
                    <Link to="/cleaner/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                      <UserIcon size={16} />
                      Edit Profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link to="/login">
                    <Button variant="secondary" size="md" className="w-full">Log in</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="md" className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
