import { Link } from 'react-router-dom';
import { Search, CheckCircle, Calendar, Home, Sparkles, Zap, Truck, Building2, Star, ArrowRight, Users, Award, Briefcase, UserCheck, BookOpen, Clock } from 'lucide-react';
import { getProfiles, getUsers } from '../utils/storage';
import type { CleanerListing } from '../types';
import CleanerCard from '../components/cleaners/CleanerCard';
import Button from '../components/ui/Button';
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

const blogPosts = [
  {
    title: '10 Cleaning Hacks That Will Save You Hours Every Week',
    excerpt: 'Discover the pro tips our top-rated cleaners use to make spaces sparkle in record time — from baking soda tricks to the two-bucket method.',
    category: 'Tips & Tricks',
    readTime: '5 min read',
    date: '2026-04-10',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=70',
    accent: 'bg-teal-50 text-teal-700',
  },
  {
    title: 'Deep Clean vs Regular Clean: Which One Do You Actually Need?',
    excerpt: 'Confused about which service to book? We break down the differences, the timing, and how to choose the right clean for your home.',
    category: 'Guides',
    readTime: '7 min read',
    date: '2026-03-28',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=70',
    accent: 'bg-purple-50 text-purple-700',
  },
  {
    title: 'How to Prep Your Home Before the Cleaner Arrives',
    excerpt: 'A few small steps before your booking can make a huge difference. Here is how to get the most value from every cleaning appointment.',
    category: 'How-To',
    readTime: '4 min read',
    date: '2026-03-15',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=70',
    accent: 'bg-amber-50 text-amber-700',
  },
];

export default function LandingPage() {
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

  return (
    <div>
      {/* Role Chooser Hero */}
      <section className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-teal-100 mb-6">
              <Sparkles size={14} /> Welcome to CleanConnect
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
              How can we help you today?
            </h1>
            <p className="text-lg sm:text-xl text-teal-100 max-w-2xl mx-auto leading-relaxed">
              Choose how you'd like to get started — book a trusted cleaner or offer your services.
            </p>
          </div>

          {/* Two big role cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <Link
              to="/register?role=client"
              className="group bg-white text-gray-900 rounded-2xl p-7 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <UserCheck size={28} />
              </div>
              <h2 className="text-2xl font-bold mb-2">I'm a Client</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Find and book verified cleaning professionals near you in minutes.
              </p>
              <span className="inline-flex items-center gap-1.5 text-teal-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                Get started <ArrowRight size={16} />
              </span>
            </Link>

            <Link
              to="/cleaner-landing"
              className="group bg-white text-gray-900 rounded-2xl p-7 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Briefcase size={28} />
              </div>
              <h2 className="text-2xl font-bold mb-2">I'm a Cleaner</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Grow your business — set your rates, schedule, and accept bookings.
              </p>
              <span className="inline-flex items-center gap-1.5 text-amber-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                Start earning <ArrowRight size={16} />
              </span>
            </Link>
          </div>

          {/* Smaller browse option */}
          <div className="text-center mt-10">
            <p className="text-sm text-teal-100 mb-3">Not ready to sign up?</p>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-colors backdrop-blur-sm"
            >
              <Search size={16} />
              Just browse cleaners
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-teal-100 mt-12 pt-8 border-t border-white/10">
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

      {/* Blog */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium mb-3">
                <BookOpen size={14} /> From the Blog
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Cleaning Tips & Insights</h2>
              <p className="text-gray-500">Expert advice to help you keep your space spotless.</p>
            </div>
            <Link to="/blog" className="hidden sm:flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors">
              View all articles <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map(post => (
              <article key={post.title} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-teal-100 transition-all duration-200 flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${post.accent}`}>
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="inline-flex items-center gap-1"><Calendar size={12} /> {formatDisplayDate(post.date)}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug group-hover:text-teal-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-teal-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                    Read article <ArrowRight size={14} />
                  </span>
                </div>
              </article>
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
            <Link to="/cleaner-landing">
              <Button size="lg" variant="secondary" className="border-white text-white hover:bg-teal-600 w-full sm:w-auto">
                I'm a Cleaner
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
