import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, Component } from 'react';
import type { ReactNode } from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { seedIfEmpty } from './utils/storage';
import Toast from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import CleanerLandingPage from './pages/CleanerLandingPage';
import CleanerOnboardingPage from './pages/cleaner/CleanerOnboardingPage';
import BrowsePage from './pages/BrowsePage';
import CleanerProfilePage from './pages/CleanerProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientBookings from './pages/client/ClientBookings';
import ClientFavorites from './pages/client/ClientFavorites';
import CleanerDashboard from './pages/cleaner/CleanerDashboard';
import CleanerBookings from './pages/cleaner/CleanerBookings';
import CleanerProfileEdit from './pages/cleaner/CleanerProfileEdit';
import CleanerEarnings from './pages/cleaner/CleanerEarnings';
import ClientProfileEdit from './pages/client/ClientProfileEdit';
import NotFoundPage from './pages/NotFoundPage';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-6">An unexpected error occurred. Please refresh the page.</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
            className="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  useEffect(() => {
    seedIfEmpty();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/cleaner-landing" element={<CleanerLandingPage />} />
          <Route path="/cleaner/onboarding" element={<CleanerOnboardingPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/cleaners/:cleanerId" element={<CleanerProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Client only */}
          <Route element={<ProtectedRoute allowedRole="client" />}>
            <Route path="/book/:cleanerId" element={<BookingPage />} />
            <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/bookings" element={<ClientBookings />} />
            <Route path="/client/favorites" element={<ClientFavorites />} />
            <Route path="/client/profile" element={<ClientProfileEdit />} />
          </Route>

          {/* Cleaner only */}
          <Route element={<ProtectedRoute allowedRole="cleaner" />}>
            <Route path="/cleaner/dashboard" element={<CleanerDashboard />} />
            <Route path="/cleaner/bookings" element={<CleanerBookings />} />
            <Route path="/cleaner/profile" element={<CleanerProfileEdit />} />
            <Route path="/cleaner/earnings" element={<CleanerEarnings />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppProvider>
          <AuthProvider>
            <BookingProvider>
              <AppContent />
            </BookingProvider>
          </AuthProvider>
        </AppProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
