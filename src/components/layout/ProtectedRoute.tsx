import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types';
import Spinner from '../ui/Spinner';

interface ProtectedRouteProps {
  allowedRole: UserRole;
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }

  if (currentUser.role !== allowedRole) {
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }

  return <Outlet />;
}
