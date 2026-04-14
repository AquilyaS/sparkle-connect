import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white mb-3">
              <Sparkles size={20} className="text-teal-400" />
              CleanConnect
            </Link>
            <p className="text-sm leading-relaxed">
              Connecting clients with trusted, professional cleaners across the United States.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-teal-400 transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Press</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="hover:text-teal-400 transition-colors">Regular Cleaning</Link></li>
              <li><Link to="/browse" className="hover:text-teal-400 transition-colors">Deep Clean</Link></li>
              <li><Link to="/browse" className="hover:text-teal-400 transition-colors">Move In/Out</Link></li>
              <li><Link to="/browse" className="hover:text-teal-400 transition-colors">Office Cleaning</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Help Center</Link></li>
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm">&copy; {new Date().getFullYear()} CleanConnect. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:text-teal-400 transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-teal-400 transition-colors">Terms</Link>
            <Link to="/" className="hover:text-teal-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
