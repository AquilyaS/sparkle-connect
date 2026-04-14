import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { seedIfEmpty } from './utils/storage';
import Toast from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import LandingPage from './pages/LandingPage';
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
import NotFoundPage from './pages/NotFoundPage';

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
      <AppProvider>
        <AuthProvider>
          <BookingProvider>
            <AppContent />
          </BookingProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
