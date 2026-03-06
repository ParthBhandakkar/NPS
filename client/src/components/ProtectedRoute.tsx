import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Spinner } from './ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'patient';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-100">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/patient'} replace />;
  }

  return <>{children}</>;
}
