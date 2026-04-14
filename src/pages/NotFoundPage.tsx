import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold text-teal-100 select-none mb-2">404</div>
        <div className="text-6xl mb-6">🧹</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Looks like this page has been swept away. Let's get you back to a clean slate.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            <Home size={16} />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
