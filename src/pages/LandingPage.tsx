import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, CheckCircle, Calendar, Home, Sparkles, Zap, Truck, Building2, Star, ArrowRight, Users, Award } from 'lucide-react';
import { getProfiles, getUsers } from '../utils/storage';
import type { CleanerListing } from '../types';
import CleanerCard from '../components/cleaners/CleanerCard';
import Button from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import Avatar from '../components/ui/Avatar';
import { formatDisplayDate } from '../utils/dateHelpers';

const testimonials = [
  {
    name: 'Jennifer M.',
    location: 'New York, NY',
    rating: 5,
    comment: "CleanConnect made finding a cleaner so easy! Within minutes I had Sarah booked and my apartment has never looked better. The platform is intuitive and the cleaners are top-notch.",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    date: '2026-03-15',
  },
  {
    name: 'Carlos R.',
    location: 'Austin, TX',
    rating: 5,
    comment: "I was skeptical at first but CleanConnect blew me away. I found a verified, insured cleaner for my office in under 5 minutes. The booking process is seamless.",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    date: '2026-02-20',
  },
  {
    name: 'Priya K.',
    location: 'Seattle, WA',
    rating: 5,
    comment: "Moving out was so stressful but booking a move-out clean through CleanConnect was the easiest part of the whole process. Got my full deposit back!",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    date: '2026-04-02',
  },
];

const services = [
  { icon: <Sparkles size={28} />, label: 'Regular Cleaning', desc: 'Scheduled maintenance to keep your home fresh and clean every week or month.', color: 'text-teal-600 bg-teal-50' },
  { icon: <Zap size={28} />, label: 'Deep Clean', desc: 'Thorough top-to-bottom cleaning for a spotless, sanitized living space.', color: 'text-purple-600 bg-purple-50' },
  { icon: <Truck size={28} />, label: 'Move In/Out', desc: 'Complete cleaning service for before or after your big move.', color: 'text-blue-600 bg-blue-50' },
  { icon: <Building2 size={28} />, label: 'Office Cleaning', desc: 'Professional cleaning for offices, shops, and commercial spaces.', color: 'text-amber-600 bg-amber-50' },
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const allProfiles = getProfiles();
  const allUsers = getUsers();
  const topCleaners: CleanerListing[] = allProfiles
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3)
    .map(profile => ({
      user: allUsers.find(u => u.id === profile.userId)!,
      profile,
    }))
    .filter(c => c.user);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find a Trusted Cleaner <span className="text-teal-200">Near You</span>
            </h1>
            <p className="text-lg sm:text-xl text-teal-100 mb-8 leading-relaxed">
              Book verified, insured cleaning professionals in minutes. Transparent pricing, real reviews, and hassle-free scheduling.
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-10">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your city or zip code..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 shadow-lg"
                />
              </div>
              <Button type="submit" size="lg" variant="primary" className="bg-white text-teal-700 hover:bg-teal-50 shadow-lg whitespace-nowrap">
                Find Cleaners
              </Button>
            </form>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-teal-100">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-teal-300" />
                10,000+ Satisfied Clients
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-teal-300" />
                500+ Verified Cleaners
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-teal-300" />
                Same-Day Booking
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How CleanConnect Works</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Get your home professionally cleaned in 3 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: '1', icon: <Search size={28} className="text-teal-600" />, title: 'Search & Filter', desc: 'Browse verified cleaners in your area. Filter by service type, price, rating, and availability.' },
              { step: '2', icon: <Calendar size={28} className="text-teal-600" />, title: 'Book Online', desc: 'Choose your preferred date, time, and service. Secure payment processed instantly.' },
              { step: '3', icon: <Home size={28} className="text-teal-600" />, title: 'Enjoy Clean Home', desc: 'Your cleaner arrives on time. Rate and review after the service to help the community.' },
            ].map(item => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cleaners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Top-Rated Cleaners</h2>
              <p className="text-gray-500">Trusted professionals loved by our community.</p>
            </div>
            <Link to="/browse" className="hidden sm:flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCleaners.map(cleaner => (
              <CleanerCard key={cleaner.user.id} cleaner={cleaner} showFavorite={false} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/browse">
              <Button variant="secondary" size="lg">Browse All Cleaners</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Services We Cover</h2>
            <p className="text-gray-500 text-lg">From regular maintenance to specialized deep cleans.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(service => (
              <Link to="/browse" key={service.label} className="group bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-teal-100 p-6 text-center transition-all duration-200">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${service.color} group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-gray-500 text-lg">Real reviews from real customers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={15} className={s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.comment}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full bg-teal-100" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location} · {formatDisplayDate(t.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Book Your First Clean?</h2>
          <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of happy clients who trust CleanConnect for their home cleaning needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse">
              <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 w-full sm:w-auto">
                Browse Cleaners
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="border-white text-white hover:bg-teal-600 w-full sm:w-auto">
                Join as a Cleaner
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
