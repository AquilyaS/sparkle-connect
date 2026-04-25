import { Link } from 'react-router-dom';
import { UserCircle, Calendar, DollarSign, CheckCircle, TrendingUp, Shield, Users } from 'lucide-react';
import Button from '../components/ui/Button';

const perks = [
  {
    icon: <TrendingUp size={22} className="text-teal-600" />,
    title: 'Grow on your terms',
    desc: 'Set your own schedule, rates, and service area. You are in control.',
  },
  {
    icon: <Shield size={22} className="text-teal-600" />,
    title: 'Build instant trust',
    desc: 'Verified badges and reviews help clients choose you with confidence.',
  },
  {
    icon: <Users size={22} className="text-teal-600" />,
    title: 'Join a growing community',
    desc: 'Thousands of cleaners are already building their businesses here.',
  },
];

export default function CleanerLandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-teal-500/30 border border-teal-400/40 rounded-full px-4 py-1.5 text-sm text-teal-100 mb-8">
              <CheckCircle size={15} className="text-teal-300" />
              Free to join · No commission on your first bookings
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Start getting cleaning clients{' '}
              <span className="text-teal-200">in your area</span>
            </h1>
            <p className="text-lg sm:text-xl text-teal-100 mb-10 leading-relaxed">
              Create your profile, set your rates, and get booked—on your terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/cleaner/onboarding">
                <Button
                  size="lg"
                  className="bg-white text-teal-700 hover:bg-teal-50 w-full sm:w-auto shadow-lg font-semibold"
                >
                  Create My Profile
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  size="lg"
                  variant="secondary"
                  className="border-white/60 text-white hover:bg-white/10 hover:border-white w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </a>
            </div>
            <p className="text-sm text-teal-200/80">
              Join cleaners building their own business and getting booked every week.
            </p>
          </div>
        </div>
      </section>

      {/* Perks strip */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {perks.map(perk => (
              <div key={perk.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {perk.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{perk.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-500 text-lg">Three simple steps to start earning.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-teal-100 z-0" />
            {[
              {
                step: '1',
                icon: <UserCircle size={28} className="text-teal-600" />,
                title: 'Create your profile',
                desc: 'Add your services, pricing, and availability.',
              },
              {
                step: '2',
                icon: <Calendar size={28} className="text-teal-600" />,
                title: 'Get booked',
                desc: 'Clients browse your profile and book instantly.',
              },
              {
                step: '3',
                icon: <DollarSign size={28} className="text-teal-600" />,
                title: 'Get paid',
                desc: 'Earn money doing what you do best.',
              },
            ].map(item => (
              <div key={item.step} className="flex flex-col items-center text-center relative z-10">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-teal-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link to="/cleaner/onboarding">
              <Button size="lg" variant="primary" className="shadow-md">
                Create My Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to start building your cleaning business?
          </h2>
          <p className="text-teal-100 text-lg mb-8">
            It only takes a few minutes to set up your profile and start getting booked.
          </p>
          <Link to="/cleaner/onboarding">
            <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 shadow-lg">
              Create My Profile — It's Free
            </Button>
          </Link>
          <p className="text-sm text-teal-200 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="underline underline-offset-2 hover:text-white">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
